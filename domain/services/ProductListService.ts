import ProductRepository from "../repository/ProductRepository";
import Product from "../entities/Product";
import Category from "../entities/Category";
import { SortOrder } from "../entities/SortOrder";
import { SortBy } from "../entities/SortBy";

export class ProductService {
    currentPage: number;
    pageLimit: number;
    skip: number;
    filter: Category | null;
    totalProducts?: number;
    categories?: Array<Category>;
    sortBy: SortBy | null = null;
    sortOrder: SortOrder = SortOrder.ASC;

    constructor(
        private repository: ProductRepository,
        pageLimit: number = 15,
    ) {
        this.currentPage = 0;
        this.pageLimit = pageLimit;
        this.skip = 0 - pageLimit;
        this.filter = null;
    }

    private resetState() {
        this.currentPage = 0;
        this.skip = 0 - this.pageLimit;
        this.totalProducts = undefined;
    }

    setFilter(category: Category | null) {
        this.filter = category;
        this.resetState();
    }

    setSort(field: SortBy | null, order: SortOrder) {
        this.sortBy = field;
        this.sortOrder = order;
        this.resetState();
    }

    async getNextPage(): Promise<Product[]> {
        this.skip += this.pageLimit; // TODO this is skipping next page
        this.currentPage += 1;
        const response = await this.repository.getPage(
            this.currentPage,
            this.pageLimit,
            this.skip,
            this.filter,
            this.sortBy,
            this.sortOrder,
        );
        this.totalProducts = response.total;

        return response.products;
    }

    async getPreviousPage(): Promise<Product[]> {
        this.currentPage -= 1;
        this.skip -= this.pageLimit;
        const response = await this.repository.getPage(
            this.currentPage,
            this.pageLimit,
            this.skip,
            this.filter,
            this.sortBy,
            this.sortOrder,
        );
        this.totalProducts = response.total;

        return response.products;
    }

    hasNext(): boolean {
        return this.totalProducts === undefined || this.currentPage * this.pageLimit < this.totalProducts;
    }

    hasPrevious(): boolean {
        console.log(this.currentPage);
        return this.currentPage > 1;
    }

    async getCategories(): Promise<Category[]> {
        if (this.categories === undefined) {
            this.categories = await this.repository.getCategories(); 
        }
        console.log("Returning categories ", this.categories);
        return this.categories;
    }
}
