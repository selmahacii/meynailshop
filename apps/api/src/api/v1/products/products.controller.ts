import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('v1/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return {
      success: true,
      data: await this.productsService.findAll(parseInt(page || '1'), parseInt(limit || '10')),
    };
  }

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold: string) {
    return {
      success: true,
      data: await this.productsService.getLowStockProducts(parseInt(threshold || '10')),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.productsService.findOne(id),
    };
  }

  @Post()
  async create(@Body() createProductDto: any) {
    return {
      success: true,
      data: await this.productsService.create(createProductDto),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return {
      success: true,
      data: await this.productsService.update(id, updateProductDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      success: true,
      data: await this.productsService.remove(id),
    };
  }
}
