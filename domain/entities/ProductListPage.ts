import Product from "./Product";

export class ProductListPage {
    constructor(
        public readonly products: Product[],
        public readonly hasNextPage: boolean,
        public readonly hasPreviousPage: boolean,
        public readonly displayRange: string,
    ) {}
}