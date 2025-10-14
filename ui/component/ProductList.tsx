import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Product from '../../domain/entities/Product';
import { ProductService } from '../../domain/services/ProductListService';
import ProductThumb from './productThumb';
import { styles } from './ProductList.styles';
import { FailedToFetchError } from '../../domain/exception/FailedToFetchError';
import { SortBy } from '../../domain/entities/SortBy';
import { SortOrder } from '../../domain/entities/SortOrder';
import { Category } from './Filter';
import { ProductListPage } from '../../domain/entities/ProductListPage';

interface ProductListProps {
  productService: ProductService;
  onProductPress: (product: Product) => void;
  filter: Category | null;
  sort: { field: SortBy | null; order: SortOrder };
}

const ProductList = ({
  productService,
  onProductPress,
  filter,
  sort,
}: ProductListProps) => {
  const [productPage, setProductPage] = useState<ProductListPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (fetcher: () => Promise<ProductListPage>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher();
        setProductPage(res);
      } catch (err) {
        if (err instanceof FailedToFetchError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching products.');
        }
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    productService.setFilter(filter);
    productService.setSort(sort.field, sort.order);
    fetchProducts(() => productService.getNextPage());
  }, [filter, sort, productService, fetchProducts]);

  const goToNextPage = () => {
    fetchProducts(() => productService.getNextPage());
  };

  const goToPreviousPage = () => {
    fetchProducts(() => productService.getPreviousPage());
  };

  const handleRetry = () => {
    fetchProducts(() => productService.getNextPage());
  };

  return (
    <>
      <View style={styles.listContainer}>
        {error ? (
          <View style={styles.loadingOverlay}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.button}>
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={productPage?.products ?? []}
            renderItem={({ item }) => (
              <ProductThumb
                product={item}
                onPress={() => onProductPress(item)}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        )}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      {!error && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={goToPreviousPage}
            disabled={!productPage?.hasPreviousPage}
            style={[
              styles.button,
              !productPage?.hasPreviousPage && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.rangeText}>{productPage?.displayRange}</Text>
          <TouchableOpacity
            onPress={goToNextPage}
            disabled={!productPage?.hasNextPage}
            style={[
              styles.button,
              !productPage?.hasNextPage && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ProductList;
