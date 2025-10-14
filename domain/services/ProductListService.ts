import ProductRepository from "../repository/ProductRepository";
import Product from "../entities/Product";
import Category from "../entities/Category";
import { SortOrder } from "../entities/SortOrder";
import { SortBy } from "../entities/SortBy";
import { FailedToFetchError } from "../exception/FailedToFetchError";
import { ProductListPage } from "../entities/ProductListPage";

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
        try {
            return await this.repository.getById(id);
        } catch (e) {
            throw new FailedToFetchError(`Failed to fetch product with id ${id}.`);
        }
    }

    async getNextPage(): Promise<ProductListPage> {
        try {
            const products = await this.repository.getNextPage();
            return new ProductListPage(
                products,
                this.repository.hasNext(),
                this.repository.hasPrevious(),
                this.repository.getProductDisplayRange()
            );
        } catch (e) {
            throw new FailedToFetchError("Failed to fetch next page of products.");
        }
    }

    async getPreviousPage(): Promise<ProductListPage> {
        try {
            const products = await this.repository.getPreviousPage();
            return new ProductListPage(
                products,
                this.repository.hasNext(),
                this.repository.hasPrevious(),
                this.repository.getProductDisplayRange()
            );
        } catch (e) {
            throw new FailedToFetchError("Failed to fetch previous page of products.");
        }
    }

    async getCategories(): Promise<Category[]> {
        try {
            return await this.repository.getCategories();
        } catch (e) {
            throw new FailedToFetchError("Failed to fetch product categories.");
        }
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
}
