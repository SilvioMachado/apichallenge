import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
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

    const productService = useMemo(
        () => new ProductService(new ProductRestRepository(10))
    , []);

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

    const goToNextPage = async () => {
        setLoading(true);
        try {
            const res = await productService.getNextPage()
            setProducts(res);
            setHasNextPage(productService.hasNext())
            setHasPreviousPage(productService.hasPrevious())
        } catch {}
       setLoading(false);
    };

    const goToPreviousPage = async () => {
        setLoading(true);
        try {
            const res = await productService.getPreviousPage()
            setProducts(res);
            setHasNextPage(productService.hasNext())
            setHasPreviousPage(productService.hasPrevious())
        } catch {}
       setLoading(false);
    }

    const handleFilterSelect = (category: Category | null) => {
        console.log("Selected category slug:", category);
        productService.setFilter(category);
        // fetchProducts();
        goToNextPage();
    };

    const handleSortChange = async (field: SortBy, order: SortOrder) => {
        setSortBy(field);
        setSortOrder(order);
        // Assuming ProductService has a setSort method that updates internal sort state
        // and resets the current page to 1.
        productService.setSort(field, order);
        setLoading(true);
        try {
            // After setting sort, fetch the first page with the new sort parameters.
            // `getNextPage()` should now fetch the first page based on the service's internal state.
            const res = await productService.getNextPage();
            setProducts(res);
            setHasNextPage(productService.hasNext());
            setHasPreviousPage(productService.hasPrevious());
        } catch (error) {
            console.error("Failed to fetch products with new sort:", error);
        }
        setLoading(false);
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
                <DetailsPage product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10, // Add horizontal padding to the main container
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sortButtonContainer: { // This will now just group the sort buttons
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
