import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { ProductRestRepository } from "../../infrastructure/repository/ProductRestRepository";
import { ProductService } from "../../domain/services/ProductListService";
import Product from "../../domain/entities/Product";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Filter, { Category } from "../component/Filter";
import SortButton from "../component/SortButton";
import { DetailsPage } from "../component/Details";
import { SortOrder } from "../../domain/entities/SortOrder";
import { SortBy } from "../../domain/entities/SortBy";
import { useDeepLink, OpenProductIntent } from "../../infrastructure/hook/useDeepLink";
import ProductList from "../component/ProductList";

import { NativeModules } from 'react-native';
import { styles } from "./Home.styles";


export const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy | null>(SortBy.PRICE); // Default sort by price
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC); // Default ascending

    const { intent, clearIntent } = useDeepLink();

    const { CalendarModule } = NativeModules;

    const productService = useMemo(
        () => new ProductService(new ProductRestRepository(10))
    , []);

    const setReminder = (product: Product | null) => {
        if (!product) {
            return;
        }

        CalendarModule.createEvent(
            `Buy ${product.title}`,
            `Buy now: ${product.getBuyURL()}`,
            new Date(2025, 10, 15, 10, 30).getTime(),
        )
    };

    useEffect(() => {
        if (intent instanceof OpenProductIntent) {
            const productId = intent.getProductId();
            if (productId) {
                productService
                    .getProductById(productId)
                    .then(( product: Product ) => {
                        setSelectedProduct(product);
                    });
                    clearIntent(); // Clear the intent after handling it.
            }
        }
    }, [intent, productService, clearIntent]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Set initial sort parameters in the service before fetching
                productService.setSort(sortBy, sortOrder); // Assuming setSort exists and resets page
                const [productsResponse, categoriesResponse] = await Promise.all([
                    productService.getNextPage(),
                    productService.getCategories(),
                ]);
                setProducts(productsResponse);
                setCategories(categoriesResponse);
                setHasNextPage(productService.hasNext());
                setHasPreviousPage(productService.hasPrevious());
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchProducts = async (fetcher: () => Promise<Product[]>) => {
        setLoading(true);
        try {
            const res = await fetcher();
            setProducts(res);
            setHasNextPage(productService.hasNext());
            setHasPreviousPage(productService.hasPrevious());
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
        setLoading(false);
    };

    const goToNextPage = () => {
        fetchProducts(() => productService.getNextPage());
    };

    const goToPreviousPage = () => {
        fetchProducts(() => productService.getPreviousPage());
    }

    const handleFilterSelect = (category: Category | null) => {
        console.log("Selected category slug:", category);
        productService.setFilter(category);
        goToNextPage();
    };

    const handleSortChange = (field: SortBy, order: SortOrder) => {
        setSortBy(field);
        setSortOrder(order);
        productService.setSort(field, order);
        goToNextPage();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.controlsContainer}>
                    <Filter categories={categories} onCategorySelect={handleFilterSelect} />
                    <View style={styles.sortButtonContainer}>
                        <SortButton label="Price" field={SortBy.PRICE} currentSortField={sortBy} currentSortOrder={sortOrder} onPress={handleSortChange} />
                        <SortButton label="Rating" field={SortBy.RATING} currentSortField={sortBy} currentSortOrder={sortOrder} onPress={handleSortChange} />
                    </View>
                </View>
                <ProductList
                    products={products}
                    onProductPress={setSelectedProduct}
                    loading={loading}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                />
                <DetailsPage 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    setReminder={() => setReminder(selectedProduct)}
                 />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};
