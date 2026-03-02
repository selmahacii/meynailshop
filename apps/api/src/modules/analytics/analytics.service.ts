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
    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'sum')
      .where('order.status = :status', { status: 'delivered' })
      .getRawOne();
    const activeProducts = await this.productRepository.count({
      where: { isActive: true },
    });
    return {
      totalOrders,
      totalRevenue: totalRevenue?.sum || 0,
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
