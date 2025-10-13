import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, Button, Modal, FlatList, Dimensions, ViewToken, ScrollView } from "react-native";
import Product from '../../domain/entities/Product';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DetailsPageProps {
    product: Product | null;
    onClose: () => void;
}

export const DetailsPage = ({ product, onClose }: DetailsPageProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const renderImage = (url: string) => (
        <View style={styles.slide}>
            <Image style={styles.image} source={{ uri: url }} />
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={!!product}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {product && (
                    <>
                        <FlatList
                            // style={styles.imageList}
                            data={product.images}
                            renderItem={({ item }) => renderImage(item)}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            horizontal
                            pagingEnabled
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            showsHorizontalScrollIndicator={false}
                            style={styles.container}
                        />
                        <View style={styles.paginationContainer}>
                            {product.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        activeIndex === index
                                            ? styles.paginationDotActive
                                            : styles.paginationDotInactive,
                                    ]}
                                />
                            ))}
                        </View>
                        <ScrollView style={styles.scrollContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.title}>{product.title}</Text>
                                <Text style={styles.description}>{product.description}</Text>
                                <Text style={styles.price}>Price: ${product.price.toString()}</Text>
                                <Text>Rating: {product.rating.toString()}</Text>
                                {product.stock > 0 ? (
                                    <Text style={styles.stockAvailable}>In Stock: {product.stock}</Text>
                                ) : (
                                    <Text style={styles.stockUnavailable}>Out of Stock</Text>
                                )}
                            </View>
                        </ScrollView>
                        <View style={styles.footer}>
                                <Button title="Close" onPress={onClose} />
                            </View>
                    </>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const { height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        width: Dimensions.get('window').width,
        height: windowHeight * 0.5,
    },
    imageList: {
        height: 100,
        marginBottom: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 0,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    footer: {
        padding: 16,
        paddingTop: 0,
    },
    stockAvailable: {
        fontSize: 16,
        color: 'green',
        marginTop: 4,
    },
    stockUnavailable: {
        fontSize: 16,
        color: 'red',
        marginTop: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: 'black',
    },
    paginationDotInactive: {
        backgroundColor: 'gray',
    },
});
