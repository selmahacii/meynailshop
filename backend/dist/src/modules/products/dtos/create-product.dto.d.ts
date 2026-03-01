export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    categoryId: string;
    stock: number;
    lowStockThreshold?: number;
    isFeatured?: boolean;
    isTopSeller?: boolean;
    tags?: string[];
    sku?: string;
}
