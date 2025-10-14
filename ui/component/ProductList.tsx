import React from 'react';
import {
    FlatList,
    ActivityIndicator,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import Product from '../../domain/entities/Product';
import ProductThumb from './productThumb';
import { styles } from './ProductList.styles';

interface ProductListProps {
    products: Product[];
    onProductPress: (product: Product) => void;
    loading: boolean;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    productDisplayRange: string;
}

const ProductList = ({
    products,
    onProductPress,
    loading,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    productDisplayRange,
}: ProductListProps) => {
    return (
        <>
            <View style={styles.listContainer}>
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <ProductThumb product={item} onPress={() => onProductPress(item)} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </View>
            <View style={styles.buttonContainer}>
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
            </View>
        </>
    );
};

export default ProductList;