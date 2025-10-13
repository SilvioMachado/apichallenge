import Category from "../entities/Category";
import Product from "../entities/Product";
import { SortBy } from "../entities/SortBy";
import { SortOrder } from "../entities/SortOrder";

export interface ProductResponse {
    products: Product[];
    total: number;
}

interface ProductRepository {
    getPage(
        page: Number, 
        limit: Number, 
        skip: number,
        filter?: Category | null,
        sortBy?: SortBy | null,
        sortOrder?: SortOrder | null,
    ): Promise<ProductResponse>;

    getCategories(): Promise<Category[]>;
}

export default ProductRepository;