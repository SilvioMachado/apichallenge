import React, { useRef, useState } from 'react';
import { Text, View, Image, Button, Modal, FlatList, ViewToken, ScrollView } from "react-native";
import Product from '../../domain/entities/Product';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Details.styles';

interface DetailsPageProps {
    product: Product | null;
    onClose: () => void;
    setReminder: () => void;
}

export const DetailsPage = ({ product, onClose, setReminder }: DetailsPageProps) => {
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
                            <Button title="Remind me" onPress={setReminder}/>
                            <Button title="Close" onPress={onClose} />
                        </View>
                    </>
                )}
            </SafeAreaView>
        </Modal>
    );
};
