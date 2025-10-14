import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Product from '../../domain/entities/Product';
import { styles } from './productThumb.styles';

interface ProductThumbProps {
  product: Product;
  onPress: () => void;
}

const ProductThumb = ({ product, onPress }: ProductThumbProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <Image style={styles.thumbnail} src={product.thumbnail} />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.rating}>Rating: {product.rating.toString()}</Text>
          <Text style={styles.price}>Price: ${product.price.toString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductThumb;
