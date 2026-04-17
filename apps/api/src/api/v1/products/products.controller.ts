import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('v1/admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: string, 
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    const result = await this.productsService.findAll(
      parseInt(page || '1'), 
      parseInt(limit || '10'),
      search
    );
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
    try {
      const thresholdVal = parseInt(threshold) || 5;
      const data = await this.productsService.getLowStockProducts(thresholdVal);
      const items = Array.isArray(data) ? data : [];
      
      return {
        success: true,
        data: {
          items: items,
          total: items.length,
          page: 1,
          limit: items.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error('❌ [ProductsV1] getLowStock Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      };
    }
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
    try {
      const data = await this.productsService.create(createProductDto);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [ProductsV1] create Error:', error);
      throw error; // rethrow so NestJS handles it properly with correct status codes
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    try {
      const data = await this.productsService.update(id, updateProductDto);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [ProductsV1] update Error:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      success: true,
      data: await this.productsService.remove(id),
    };
  }
}
