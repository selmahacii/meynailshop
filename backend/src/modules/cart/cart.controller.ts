import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

class ValidateStockDto {
    productId: string;
    quantity: number;
    variantId?: string;
}

class ValidateCouponDto {
    code: string;
}

@Controller('api/v1/cart')
export class CartController {
    constructor(private productsService: ProductsService) { }

    @Post('validate-stock')
    async validateStock(@Body() dto: ValidateStockDto) {
        return this.productsService.validateStock(dto.productId, dto.quantity);
    }
}
