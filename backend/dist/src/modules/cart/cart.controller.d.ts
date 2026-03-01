import { ProductsService } from '../products/products.service';
declare class ValidateStockDto {
    productId: string;
    quantity: number;
    variantId?: string;
}
export declare class CartController {
    private productsService;
    constructor(productsService: ProductsService);
    validateStock(dto: ValidateStockDto): Promise<{
        valid: boolean;
        currentStock: number;
        productId: string;
    }>;
}
export {};
