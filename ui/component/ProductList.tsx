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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [productDisplayRange, setProductDisplayRange] = useState<string>("");

    const fetchProducts = useCallback(async (fetcher: () => Promise<Product[]>) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetcher();
            setProducts(res);
            setHasNextPage(productService.hasNext());
            setHasPreviousPage(productService.hasPrevious());
            setProductDisplayRange(productService.getProductDisplayRange());
        } catch (error) {
            if (error instanceof FailedToFetchError) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred while fetching products.");
            }
        }
        setLoading(false);
    }, [productService]);

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
    }

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
                    data={products}
                    renderItem={({ item }) => (
                        <ProductThumb product={item} onPress={() => onProductPress(item)} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
                )}
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </View>
            {!error && <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={goToPreviousPage}
                    disabled={!hasPreviousPage}
                    style={[styles.button, !hasPreviousPage && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.rangeText}>{productDisplayRange}</Text>
                <TouchableOpacity
                    onPress={goToNextPage}
                    disabled={!hasNextPage}
                    style={[styles.button, !hasNextPage && styles.buttonDisabled]}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>}
        </>
    );
};

export default ProductList;