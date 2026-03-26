import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Review, OrderItem, Product } from '../../../database/entities';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { StockModule } from '../../../modules/stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Review, OrderItem, Product]), StockModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
