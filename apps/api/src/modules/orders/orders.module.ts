import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, Address, Product, Coupon } from '../../database/entities';
import { OrdersService } from './orders.service';
import { OrderItemsService } from './order-items.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Address, Product, Coupon]),
    CartModule,
  ],
  providers: [OrdersService, OrderItemsService],
  controllers: [OrdersController],
  exports: [OrdersService, OrderItemsService],
})
export class OrdersModule {}
