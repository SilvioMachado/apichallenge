import ProductRepository from "../repository/ProductRepository";
import Product from "../entities/Product";
import Category from "../entities/Category";

export class ProductService {
    currentPage: number;
    pageLimit: number;
    skip: number;
    filter: Category | null;
    totalProducts?: number;
    categories?: Array<Category>;
    sortBy?: string;
    sortOrder?: string;

    constructor(
        private repository: ProductRepository,
        pageLimit: number = 15,
    ) {
        this.currentPage = 0;
        this.pageLimit = pageLimit;
        this.skip = 0;
        this.filter = null;
    }

    setFilter(category: Category | null) {
        this.currentPage = 1;
        this.skip = 0;
        this.totalProducts = undefined;
        this.filter = category;
    }

    async getNextPage(): Promise<Product[]> {
        this.skip += this.pageLimit; // TODO this is skipping next page
        this.currentPage += 1;
        const response = await this.repository.getPage(
            this.currentPage,
            this.pageLimit,
            this.skip,
            this.filter,
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
