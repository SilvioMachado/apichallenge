import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ProductService } from '../../domain/services/ProductListService';
import Product from '../../domain/entities/Product';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Filter, { Category } from '../component/Filter';
import SortButton from '../component/SortButton';
import { ProductDetails } from '../component/ProductDetails';
import { SortOrder } from '../../domain/entities/SortOrder';
import { SortBy } from '../../domain/entities/SortBy';
import {
  useDeepLink,
  OpenProductIntent,
} from '../../infrastructure/hook/useDeepLink';
import ProductList from '../component/ProductList';

import { styles } from './Home.styles';
import { ProductRestRepository } from '../../infrastructure/repository/ProductRestRepository';
import { NotificationService } from '../../domain/services/NotificationService';
import { AndroidCalendarProvider } from '../../infrastructure/calendar/AndroidCalendarProvider';

export const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<SortBy | null>(SortBy.PRICE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC); // Default ascending
  const [filter, setFilter] = useState<Category | null>(null);

  const { intent, clearIntent } = useDeepLink();

  const productService = useMemo(
    () => new ProductService(new ProductRestRepository(10)),
    [],
  );

  const notificationService = useMemo(
    () => new NotificationService(new AndroidCalendarProvider()),
    [],
  );

  const setReminder = (product: Product | null, date: Date) => {
    if (!product) {
      return;
    }

    notificationService.createBuyReminder(date, product);
  };

  useEffect(() => {
    if (intent instanceof OpenProductIntent) {
      const productId = intent.getProductId();
      if (productId) {
        productService.getProductById(productId).then((product: Product) => {
          setSelectedProduct(product);
        });
        clearIntent(); // Clear the intent after handling it.
      }
    }
  }, [intent, productService, clearIntent]);

  const handleFilterSelect = (category: Category | null) => {
    setFilter(category);
  };

  const handleSortChange = (field: SortBy, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Make sure sorting does not change just because we opened and closed the Product Details component.
  const sort = useMemo(
    () => ({
      field: sortBy,
      order: sortOrder,
    }),
    [sortBy, sortOrder],
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Sorting and Filtering */}
        <View style={styles.controlsContainer}>
          <Filter
            onCategorySelect={handleFilterSelect}
            fetchCategories={() => productService.getCategories()}
          />
          <View style={styles.sortButtonContainer}>
            <SortButton
              label="Price"
              field={SortBy.PRICE}
              currentSortField={sortBy}
              currentSortOrder={sortOrder}
              onPress={handleSortChange}
            />
            <SortButton
              label="Rating"
              field={SortBy.RATING}
              currentSortField={sortBy}
              currentSortOrder={sortOrder}
              onPress={handleSortChange}
            />
          </View>
        </View>

        {/* Product List */}
        <ProductList
          productService={productService}
          onProductPress={setSelectedProduct}
          filter={filter}
          sort={sort}
        />

        {/* Selected Product Details */}
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          setReminder={(date: Date) => setReminder(selectedProduct, date)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
