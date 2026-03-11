import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page: string, limit: string): Promise<{
        success: boolean;
        data: {
            items: import("../../../database/entities").Product[];
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
            items: import("../../../database/entities").Product[];
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
