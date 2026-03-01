import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [ProductsModule],
    controllers: [CartController],
})
export class CartModule { }
