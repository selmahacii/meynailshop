import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProductsQueryDto } from './dto/products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
  ) {}

  @Get()
  async findAll(@Query() query: ProductsQueryDto) {
    const result = await this.productsService.findAll(query);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get('featured')
  async featured() {
    return {
      statusCode: 200,
      data: await this.productsService.findFeatured(6),
    };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return {
      statusCode: 200,
      data: await this.productsService.findBySlug(slug),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createProductDto: any) {
    return {
      statusCode: 201,
      message: 'Product created',
      data: await this.productsService.create(createProductDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return {
      statusCode: 200,
      message: 'Product updated',
      data: await this.productsService.update(id, updateProductDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      statusCode: 200,
      data: await this.productsService.remove(id),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: { quantity: number },
  ) {
    return {
      statusCode: 200,
      message: 'Stock updated',
      data: await this.productsService.updateStock(id, updateStockDto.quantity),
    };
  }
}
