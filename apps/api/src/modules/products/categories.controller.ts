import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return {
      statusCode: 200,
      data: await this.categoriesService.findAll(),
    };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return {
      statusCode: 200,
      data: await this.categoriesService.findBySlug(slug),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createCategoryDto: any) {
    return {
      statusCode: 201,
      message: 'Category created',
      data: await this.categoriesService.create(createCategoryDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return {
      statusCode: 200,
      message: 'Category updated',
      data: await this.categoriesService.update(id, updateCategoryDto),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      statusCode: 200,
      data: await this.categoriesService.remove(id),
    };
  }
}
