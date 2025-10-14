import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Product from "../../domain/entities/Product";
import { styles } from "./productThumb.styles";

interface ProductThumbProps {
    product: Product;
    onPress: () => void;
}

const ProductThumb = ({ product, onPress }: ProductThumbProps) => {
    return <TouchableOpacity onPress={onPress}>
        <View style={styles.container} >
            <Image
                style={styles.thumbnail}
                src={product.thumbnail}
                />
            <View>
                <Text>{product.title}</Text>
                <Text>Price: {product.price.toString()}</Text>
                <Text>Rating: {product.rating.toString()}</Text>
            </View>
        </View>
    </TouchableOpacity>
};

export default ProductThumb;
