import ProductRepository, { ProductResponse } from "../../domain/repository/ProductRepository";
import Category from "../../domain/entities/Category";
import { SortOrder } from "../../domain/entities/SortOrder";
import { SortBy } from "../../domain/entities/SortBy";
import Product from "../../domain/entities/Product";

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

    private toProduct(p: any): Product {
        return new Product(
            p.id,
            p.title,
            p.description,
            p.category,
            p.price,
            p.thumbnail,
            p.rating,
            p.images,
            p.stock
        );
    }

    private async fetchPage(
        limit: number,
        skip: number,
    ): Promise<ProductResponse> {
        let url = "https://dummyjson.com/products";
        if (this.filter !== null) {
            url += `/category/${this.filter.slug}`;
        }
        url += `?limit=${limit}&skip=${skip}`;
        if (this.sortBy) {
            url += `&sortBy=${this.sortBy}&order=${this.sortOrder}`;
        }
        // select only necessary elements to improve performance
        url += "&select=id,title,description,category,price,thumbnail,rating,images,stock"
        console.log("using URL ", url);
        const res = await fetch(url);
        const json: ProductResponse = await res.json();

        return json;
    }

    async getNextPage(): Promise<Product[]> {
        const skip = this.skip + this.pageLimit;
        const currentPage = this.currentPage + 1;

        const response = await this.fetchPage(this.pageLimit, skip);
        const products = response.products.map(p => this.toProduct(p));

        this.skip = skip;
        this.currentPage = currentPage;
        this.totalProducts = response.total;

        return products;
    }

    async getPreviousPage(): Promise<Product[]> {
        const skip = this.skip - this.pageLimit;
        const currentPage = this.currentPage - 1;

        const response = await this.fetchPage(this.pageLimit, skip);
        const products = response.products.map(p => this.toProduct(p));

        this.skip = skip;
        this.currentPage = currentPage;
        this.totalProducts = response.total;

        return products;
    }

    async getById(id: number): Promise<Product> {
        let url = `https://dummyjson.com/products/${id}`;
        const res = await fetch(url);
        const json = await res.json();
        return this.toProduct(json);
    }

    hasNext(): boolean {
        return this.totalProducts === undefined || this.currentPage * this.pageLimit < this.totalProducts;
    }

    hasPrevious(): boolean {
        return this.currentPage > 1;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public getTotalProducts(): number | undefined {
        return this.totalProducts;
    }

    public getPageLimit(): number {
        return this.pageLimit;
    }

    public getProductDisplayRange(): string {
        if (this.totalProducts === undefined || this.currentPage === 0) {
            return "";
        }

        const start = this.skip + 1;
        const end = Math.min(this.skip + this.pageLimit, this.totalProducts);
        return `${start} - ${end}`;
    }

    async getCategories(): Promise<Category[]> {
        if (this.categories === undefined) {
            const res = await fetch("https://dummyjson.com/products/categories");
            this.categories = await res.json();
        }
        return this.categories || [];
    }
}
