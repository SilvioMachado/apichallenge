import React from 'react';
import {
    FlatList,
    ActivityIndicator,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import Product from '../../domain/entities/Product';
import ProductThumb from './productThumb';

interface ProductListProps {
    products: Product[];
    onProductPress: (product: Product) => void;
    loading: boolean;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const ProductList = ({
    products,
    onProductPress,
    loading,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
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

const styles = StyleSheet.create({
    listContainer: { flex: 1 },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
    buttonDisabled: { backgroundColor: '#d3d3d3' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ProductList;