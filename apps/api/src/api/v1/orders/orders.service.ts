import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Review } from '../../../database/entities';
import { StockService } from '../../../modules/stock/stock.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private stockService: StockService,
  ) {}

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC');

    if (status && status !== 'all') {
      query.where('order.status = :status', { status });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items'],
    });
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);
    
    // Automatically restore stock if order is cancelled or returned
    if (
      (status === 'cancelled' || status === 'returned') && 
      (order.status !== 'cancelled' && order.status !== 'returned')
    ) {
      for (const item of order.items) {
        if (item.productId && item.quantity) {
          try {
            await this.stockService.adjustStock(
              item.productId,
              item.quantity,
              `Restitution de stock: Commande ${status === 'returned' ? 'retournée' : 'annulée'}`,
              order.orderNumber
            );
          } catch (error) {
            console.error(`Failed to restore stock for product ${item.productId} in order ${order.orderNumber}`, error);
          }
        }
      }
    }

    await this.orderRepository.update(id, { status });
    return await this.findOne(id);
  }

  async getStats() {
    try {
      const [orders, pendingReviews] = await Promise.all([
        this.orderRepository.find(),
        this.reviewRepository.count({ where: { status: 'pending' } }),
      ]);

      const stats = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 'pending').length,
        shipped: orders.filter((o: any) => o.status === 'shipped').length,
        delivered: orders.filter((o: any) => o.status === 'delivered').length,
        cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
        returned: orders.filter((o: any) => o.status === 'returned').length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0),
        pendingReviews,
      };

      return stats;
    } catch (error) {
      console.error('❌ [OrdersV1] getStats Error:', error);
      return {
        total: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0,
        totalRevenue: 0,
        pendingReviews: 0,
      };
    }
  }
}
