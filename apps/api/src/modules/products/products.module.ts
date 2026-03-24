import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Category, SubCategory } from '../../database/entities';
import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { StoreProductsController } from './products.controller';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory])],
  providers: [ProductsService, CategoriesService],
  controllers: [StoreProductsController, CategoriesController],
  exports: [ProductsService, CategoriesService],
})
export class StoreProductsModule {}
