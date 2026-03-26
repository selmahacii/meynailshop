export declare class CreateProductDto {
    name: string;
    slug?: string;
    description: string;
    shortDescription: string;
    sku: string;
    price: number;
    comparePrice?: number;
    costPrice: number;
    stock: number;
    stockAlert?: number;
    images?: string[];
    categoryId: string;
    badge?: 'top' | 'new' | 'promo';
    isActive?: boolean;
    isFeatured?: boolean;
    weight?: number;
    tags?: string[];
    hasVariants?: boolean;
    variants?: {
        sku: string;
        image: string;
        label: string;
    }[];
}
