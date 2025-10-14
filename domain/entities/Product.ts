class Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail: string;
    rating: number;
    images: Array<string>;
    stock: number;

    constructor(
        id: number,
        title: string,
        description: string,
        category: string,
        price: number,
        thumbnail: string,
        rating: number,
        images: Array<string>,
        stock: number
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.category = category
        this.price = price
        this.thumbnail = thumbnail
        this.rating = rating
        this.images = images
        this.stock = stock
    }

    getBuyURL(): string {
        return `https://apichallenge.com/product/${this.id}`
    }
}

export default Product;
