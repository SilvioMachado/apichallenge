interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail: string;
    rating: number;
    images: Array<string>;
    stock: number;
};


export default Product;