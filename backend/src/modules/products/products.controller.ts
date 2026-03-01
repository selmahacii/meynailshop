import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('api/v1/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll(@Query() filter: ProductFilterDto) {
        return this.productsService.findAll(filter);
    }

    @Get('top-sellers')
    findTopSellers(@Query('limit') limit?: string) {
        return this.productsService.findTopSellers(limit ? parseInt(limit) : 8);
    }

    @Get('featured')
    findFeatured() {
        return this.productsService.findFeatured();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.productsService.findById(id);
    }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Patch(':id/stock')
    updateStock(
        @Param('id') id: string,
        @Body('stock') stock: number,
    ) {
        return this.productsService.updateStock(id, stock);
    }
}
