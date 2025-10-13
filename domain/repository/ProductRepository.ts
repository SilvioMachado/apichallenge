import Category from "../entities/Category";
import Product from "../entities/Product";

export interface ProductResponse {
    products: Product[];
    total: number;
}

interface ProductRepository {
    getPage(
        page: Number, 
        limit: Number, 
        skip: number,
        filter?: Category | null
    ): Promise<ProductResponse>;
    getCategories(): Promise<Category[]>;
    // sort(sortBy: string, order: string): Promise<Product[]>;
    // filterCategory(categories: string): Promise<Product[]>;
}

export default ProductRepository;