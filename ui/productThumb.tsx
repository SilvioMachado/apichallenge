import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Product from "../domain/product";

interface ProductThumbProps {
    product: Product;
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "blue",
        alignItems: "center",
        marginBottom: 10,
        height: 150
    },
    thumbnail: {
        height: 100,
        width: 100,
        resizeMode: "contain"
    },
    description: {
    }
})

const ProductThumb = ({ product }: ProductThumbProps) => {
    return <View style={styles.container} >
        <Image
            style={styles.thumbnail}
            src={product.thumbnail}
            />
        <View style={styles.description}>
            <Text>{product.title}</Text>
            <Text>Price: {product.price.toString()}</Text>
            <Text>Rating: {product.rating.toString()}</Text>
        </View>
    </View>
};

export default ProductThumb;
