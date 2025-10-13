import Category from "../entities/Category";
import Product from "../entities/Product";
import { SortBy } from "../entities/SortBy";
import { SortOrder } from "../entities/SortOrder";

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export default interface ProductRepository {
    setFilter(category: Category | null): void;
    setSort(field: SortBy | null, order: SortOrder): void;
    getNextPage(): Promise<Product[]>;
    getPreviousPage(): Promise<Product[]>;
    hasNext(): boolean;
    hasPrevious(): boolean;
    getCategories(): Promise<Category[]>;
}