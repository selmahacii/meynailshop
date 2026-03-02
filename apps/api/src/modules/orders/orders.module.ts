import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Address } from '../../database/entities/address.entity';
import { Product } from '../../database/entities/product.entity';
import { Coupon } from '../../database/entities/coupon.entity';
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
