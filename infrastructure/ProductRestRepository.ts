import ProductRepository, { ProductResponse } from "../domain/repository/ProductRepository";
import Category from "../domain/entities/Category";
import { SortOrder } from "../domain/entities/SortOrder";
import { SortBy } from "../domain/entities/SortBy";
import Product from "../domain/entities/Product";

export class ProductRestRepository implements ProductRepository {
    private currentPage: number = 0;
    private pageLimit: number;
    private skip: number = 0;
    private filter: Category | null = null;
    private totalProducts?: number;
    private sortBy: SortBy | null = null;
    private sortOrder: SortOrder = SortOrder.ASC;
    private categories?: Array<Category>;

    constructor(pageLimit: number = 10) {
        this.pageLimit = pageLimit;
        this.skip = 0 - this.pageLimit; // Initialize to fetch first page correctly with getNextPage
    }

    private resetState() {
        this.currentPage = 0;
        this.skip = 0 - this.pageLimit;
        this.totalProducts = undefined;
    }

    setFilter(category: Category | null): void {
        this.filter = category;
        this.resetState();
    }

    setSort(field: SortBy | null, order: SortOrder): void {
        this.sortBy = field;
        this.sortOrder = order;
        this.resetState();
    }

    private async fetchPage(): Promise<ProductResponse> {
        let url = "https://dummyjson.com/products";
        if (this.filter !== null) {
            url += `/category/${this.filter.slug}`;
        }
        url += `?limit=${this.pageLimit}&skip=${this.skip}`;
        if (this.sortBy) {
            url += `&sortBy=${this.sortBy}&order=${this.sortOrder}`;
        }
        // select only necessary elements to improve performance
        url += "&select=id,title,description,category,price,thumbnail,rating,images,stock"
        console.log("Using URL ", url);
        const res = await fetch(url);
        const json: ProductResponse = await res.json();

        return json;
    }

    async getNextPage(): Promise<Product[]> {
        this.skip += this.pageLimit;
        this.currentPage += 1;
        const response = await this.fetchPage();
        this.totalProducts = response.total;
        return response.products;
    }

    async getPreviousPage(): Promise<Product[]> {
        this.skip -= this.pageLimit;
        this.currentPage -= 1;
        const response = await this.fetchPage();
        this.totalProducts = response.total;
        return response.products;
    }

    hasNext(): boolean {
        return this.totalProducts === undefined || this.currentPage * this.pageLimit < this.totalProducts;
    }

    hasPrevious(): boolean {
        return this.currentPage > 1;
    }

    async getCategories(): Promise<Category[]> {
        if (this.categories === undefined) {
            const res = await fetch("https://dummyjson.com/products/categories");
            this.categories = await res.json();
        }
        return this.categories || [];
    }
}
