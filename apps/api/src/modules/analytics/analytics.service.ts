import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async getDashboard() {
    const totalOrders = await this.orderRepository.count();
    const deliveredRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'sum')
      .where('order.status = :status', { status: 'delivered' })
      .getRawOne();
      
    const returnCosts = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.returnCost)', 'sum')
      .where('order.status = :status', { status: 'returned' })
      .getRawOne();
      
    const totalRevenue = (Number(deliveredRevenue?.sum) || 0) - (Number(returnCosts?.sum) || 0);
    const activeProducts = await this.productRepository.count({
      where: { isActive: true },
    });
    return {
      totalOrders,
      totalRevenue: totalRevenue,
      activeProducts,
      timestamp: new Date(),
    };
  }

  async getSalesByPeriod(days: number) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.orderRepository.find({
      where: {
        createdAt: Between(startDate, new Date()),
        status: 'delivered',
      },
    });
  }
}
