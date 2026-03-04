import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Category } from '../../database/entities';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { ProductsController } from './products.controller';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService, CategoriesService],
  controllers: [ProductsController, CategoriesController],
  exports: [ProductsService, CategoriesService],
})
export class ProductsModule {}
