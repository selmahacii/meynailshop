import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/database/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const query = this.orderRepository.createQueryBuilder('order');

    if (status) {
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
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }
    return order;
  }

  async updateStatus(id: string, status: string) {
    await this.orderRepository.update(id, { status });
    return await this.findOne(id);
  }

  async getStats() {
    const orders = await this.orderRepository.find();

    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === 'pending').length,
      delivered: orders.filter((o: any) => o.status === 'delivered').length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0),
    };

    return stats;
  }
}
