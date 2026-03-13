import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Review } from '../../../database/entities';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { StockModule } from '../../../modules/stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Review]), StockModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
