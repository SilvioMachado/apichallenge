import ProductRepository, { ProductResponse } from "../domain/repository/ProductRepository";
import Category from "../domain/entities/Category";
import { SortOrder } from "../domain/entities/SortOrder";
import { SortBy } from "../domain/entities/SortBy";

export class ProductRestRepository implements ProductRepository {
    async getPage(
        page: Number, 
        limit: Number, 
        skip: Number,
        filter: Category | null,
        sortBy: SortBy | null,
        sortOrder: SortOrder,
    ): Promise<ProductResponse> {
        let url = "https://dummyjson.com/products";
        if (filter !== null) {
            url += `/category/${filter.slug}`;
        }
        url += `?limit=${limit}&skip=${skip}`;
        if (sortBy) {
            url += `&sortBy=${sortBy}&order=${sortOrder}`;
        }
        // select only necessary elements to improve performance
        url += "&select=id,title,description,category,price,thumbnail,rating,images,stock"
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
