import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderItemRepository.find({
      where: { orderId },
    });
  }

  async findOne(id: string): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    return item;
  }

  async countByProductId(productId: string): Promise<number> {
    return this.orderItemRepository.count({
      where: { productId },
    });
  }

  async getTotalSalesByProductId(productId: string): Promise<number> {
    const result = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('SUM(item.quantity)', 'total')
      .where('item.productId = :productId', { productId })
      .getRawOne();

    return Number(result?.total || 0);
  }

  async getProductRevenue(productId: string): Promise<number> {
    const result = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('SUM(item.subtotal)', 'total')
      .where('item.productId = :productId', { productId })
      .getRawOne();

    return Number(result?.total || 0);
  }

  async getOrderItemsStats(orderId: string) {
    const items = await this.orderItemRepository.find({
      where: { orderId },
    });

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      itemCount: items.length,
      totalQuantity,
      totalValue,
      items,
    };
  }
}
