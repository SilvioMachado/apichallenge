import ProductRepository from "../repository/ProductRepository";
import Product from "../entities/Product";
import Category from "../entities/Category";
import { SortOrder } from "../entities/SortOrder";
import { SortBy } from "../entities/SortBy";

export class ProductService {
    constructor(
        private repository: ProductRepository,
    ) {}

    setFilter(category: Category | null) {
        this.repository.setFilter(category);
    }

    setSort(field: SortBy | null, order: SortOrder) {
        this.repository.setSort(field, order);
    }

    async getProductById(id: number): Promise<Product> {
        return this.repository.getById(id);
    }

    async getNextPage(): Promise<Product[]> {
        return this.repository.getNextPage();
    }

    async getPreviousPage(): Promise<Product[]> {
        return this.repository.getPreviousPage();
    }

    hasNext(): boolean {
        return this.repository.hasNext();
    }

    hasPrevious(): boolean {
        return this.repository.hasPrevious();
    }

    async getCategories(): Promise<Category[]> {
        return this.repository.getCategories();
    }

    getCurrentPage(): number {
        return this.repository.getCurrentPage();
    }

    getTotalProducts(): number | undefined {
        return this.repository.getTotalProducts();
    }

    getPageLimit(): number {
        return this.repository.getPageLimit();
    }

    getProductDisplayRange(): string {
        return this.repository.getProductDisplayRange();
    }
}
