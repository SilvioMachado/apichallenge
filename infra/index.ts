import { ProductRepository, ProductResponse} from "../domain/client";
import Product, { Category } from "../domain/product";

export async function getFirstPage(): Promise<Product[]> {
    const res = await fetch('https://dummyjson.com/products');
    const json: ProductResponse = await res.json();

    return json.products;
}

export class ProductRestRepository implements ProductRepository {
    async getPage(
        page: Number, 
        limit: Number, 
        skip: Number,
        filter: Category | null,
    ): Promise<ProductResponse> {
        let url = "https://dummyjson.com/products";
        if (filter !== null) {
            url += `/category/${filter.slug}`;
        }
        url += `?limit=${limit}&skip=${skip}`;
        console.log("Using URL ", url);
        const res = await fetch(url);
        const json: ProductResponse = await res.json();

        return json;
    }

    async getCategories(): Promise<Category[]> {
        const res = await fetch("https://dummyjson.com/products/categories")
        const json = await res.json();
        return json;
    }

    // async sort(sortBy: string, order: string): Promise<Product[]> {
    //     return this.getPage(1, 1, 0);       
    // }

    // async filterCategory(categories: string): Promise<Product[]> {
    //     return this.getPage(1, 1, 0);       
    // }
}
