import Product, { Category} from "./product";

export interface ProductResponse {
    products: Product[];
    total: number;
}

export interface ProductRepository {
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
