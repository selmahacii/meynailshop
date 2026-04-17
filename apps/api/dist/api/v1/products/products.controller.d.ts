import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page: string, limit: string, search: string): Promise<{
        success: boolean;
        data: {
            items: {
                sku: string;
                category: any;
                subCategory: any;
                status: "in_stock" | "low_stock" | "out_of_stock";
                alertThreshold: number;
                id: string;
                name: string;
                slug: string;
                description: string;
                shortDescription: string;
                price: number;
                comparePrice: number;
                costPrice: number;
                stock: number;
                stockAlert: number;
                images: string[];
                categoryId: string;
                subCategoryId: string;
                badge: "top" | "new" | "promo" | null;
                isActive: boolean;
                isFeatured: boolean;
                weight: number;
                tags: string[];
                hasVariants: boolean;
                variants: {
                    sku: string;
                    image: string;
                    stock: number;
                    stockAlert: number;
                }[] | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getLowStock(threshold: string): Promise<{
        success: boolean;
        data: {
            items: any[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../../../database/entities").Product;
    }>;
    create(createProductDto: any): Promise<{
        success: boolean;
        data: import("../../../database/entities").Product[];
    }>;
    update(id: string, updateProductDto: any): Promise<{
        success: boolean;
        data: import("../../../database/entities").Product;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            success: boolean;
        };
    }>;
}
