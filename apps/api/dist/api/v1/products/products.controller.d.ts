import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page: string, limit: string): Promise<{
        success: boolean;
        data: {
            data: import("../../../database/entities").Product[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
    }>;
    getLowStock(threshold: string): Promise<{
        success: boolean;
        data: import("../../../database/entities").Product[];
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
