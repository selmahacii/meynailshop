import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('v1/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const result = await this.productsService.findAll(parseInt(page || '1'), parseInt(limit || '10'));
    return {
      success: true,
      data: {
        items: result.data,
        total: result.pagination.total,
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalPages: result.pagination.pages,
        hasNext: result.pagination.page < result.pagination.pages,
        hasPrev: result.pagination.page > 1,
      },
    };
  }

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold: string) {
    const data = await this.productsService.getLowStockProducts(parseInt(threshold || '10'));
    return {
      success: true,
      data: {
        items: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
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
