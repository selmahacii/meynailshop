export declare enum ProductSortBy {
    PRICE_ASC = "price-asc",
    PRICE_DESC = "price-desc",
    NEWEST = "newest",
    RATING = "rating",
    POPULAR = "popular"
}
export declare class ProductFilterDto {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    inStock?: boolean;
    sort?: ProductSortBy;
    page?: number;
    limit?: number;
}
