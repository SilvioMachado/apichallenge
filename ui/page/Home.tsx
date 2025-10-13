import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, ActivityIndicator, StyleSheet, View, Button } from "react-native";
import ProductThumb from "../component/productThumb";
import { ProductRestRepository } from "../../infrastructure/ProductRestRepository";
import { ProductService } from "../../domain/services/ProductListService";
import Product from "../../domain/entities/Product";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Filter, { Category } from "../component/Filter";
import { DetailsPage } from "../component/Details";

export const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState<Number>(1);
    const [loading, setLoading] = useState<Boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const serviceRef = useRef(
        new ProductService(new ProductRestRepository(), 3)
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    serviceRef.current.getNextPage(),
                    serviceRef.current.getCategories(),
                ]);
                setProducts(productsResponse);
                setCategories(categoriesResponse);
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
            const res = await serviceRef.current.getNextPage()
            setProducts(res);
            setHasNextPage(serviceRef.current.hasNext())
            setHasPreviousPage(serviceRef.current.hasPrevious())
        } catch {}
       setLoading(false);
    };

    const fetchProducts = async () => {
        console.log("Fetching products");
        setLoading(true);
        const response = await serviceRef.current.getNextPage();
        setProducts(response);
        setHasNextPage(serviceRef.current.hasNext())
        setHasPreviousPage(serviceRef.current.hasPrevious())
        setLoading(false);
    };

    const goToPreviousPage = async () => {
        setLoading(true);
        try {
            const res = await serviceRef.current.getPreviousPage()
            setProducts(res);
            setHasNextPage(serviceRef.current.hasNext())
            setHasPreviousPage(serviceRef.current.hasPrevious())
        } catch {}
       setLoading(false);
    }

    const handleFilterSelect = (category: Category | null) => {
        console.log("Selected category slug:", category);
        serviceRef.current.setFilter(category);
        // fetchProducts();
        goToNextPage();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Filter categories={categories} onCategorySelect={handleFilterSelect} />
                {
                    loading && <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                        </View>
                }
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {
                        products && products.map((value: Product) => (
                                <ProductThumb
                                    product={value} 
                                    onPress={() => setSelectedProduct(value)}
                                />
                            )
                        )
                    }
                </ScrollView>
                <Button
                    key="next"
                    onPress={goToNextPage}
                    title="Next"
                    disabled={!hasNextPage}
                />
                <Button
                    key="previous"
                    onPress={goToPreviousPage}
                    title="Previous"
                    disabled={!hasPreviousPage}
                />
                <DetailsPage product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    loadingContainer: {
        height: "100%",
        width: "100%"
    },
});
