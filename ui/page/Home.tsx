import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ActivityIndicator, StyleSheet, View, Button, TouchableOpacity, Text } from "react-native";
import ProductThumb from "../component/productThumb";
import { ProductRestRepository } from "../../infrastructure/ProductRestRepository";
import { ProductService } from "../../domain/services/ProductListService";
import Product from "../../domain/entities/Product";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Filter, { Category } from "../component/Filter";
import SortButton from "../component/SortButton";
import { DetailsPage } from "../component/Details";
import { SortOrder } from "../../domain/entities/SortOrder";
import { SortBy } from "../../domain/entities/SortBy";

export const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy | null>(SortBy.PRICE); // Default sort by price
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC); // Default ascending

    const productService = useMemo(
        () => new ProductService(new ProductRestRepository(10))
    , []);

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
                <View style={styles.listContainer}>
                    <FlatList
                        data={products}
                        renderItem={({ item }) => (
                            <ProductThumb product={item} onPress={() => {setSelectedProduct(item);}} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    {
                        loading && <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                    }
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={goToPreviousPage}
                        disabled={!hasPreviousPage}
                        style={[styles.button, !hasPreviousPage && styles.buttonDisabled]}
                    >
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={goToNextPage}
                        disabled={!hasNextPage}
                        style={[styles.button, !hasNextPage && styles.buttonDisabled]}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <DetailsPage product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire parent (listContainer)
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
        zIndex: 10, // Ensure it's above other content
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: '#d3d3d3',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
