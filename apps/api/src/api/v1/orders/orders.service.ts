import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Review, OrderItem, Product } from '../../../database/entities';
import { StockService } from '../../../modules/stock/stock.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private stockService: StockService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll(page: number = 1, limit: number = 10, status?: string) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC');

    if (status && status !== 'all') {
      if (status === 'active') {
        query.where('order.status NOT IN (:...excluded)', { excluded: ['delivered', 'returned', 'cancelled'] });
      } else if (status === 'history') {
        query.where('order.status IN (:...included)', { included: ['delivered', 'returned', 'cancelled'] });
      } else {
        query.where('order.status = :status', { status });
      }
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
        active: orders.filter((o: any) => !['delivered', 'returned', 'cancelled'].includes(o.status)).length,
        history: orders.filter((o: any) => ['delivered', 'returned', 'cancelled'].includes(o.status)).length,
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
        active: 0,
        history: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0,
        totalRevenue: 0,
        pendingReviews: 0,
      };
    }
  }

  async createManual(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderNumber = `MAN-${Date.now()}`;
      
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        source: data.source || 'other',
        deliveryType: data.deliveryType || 'home',
        paymentMethod: data.paymentMethod || 'cash_on_delivery',
        paymentStatus: data.paymentStatus || 'pending',
        status: 'confirmed',
        subtotal: data.subtotal,
        shippingCost: data.shippingCost || 0,
        total: data.subtotal + (data.shippingCost || 0),
        shippingAddressSnapshot: data.customer,
        notes: data.notes,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      for (const item of data.items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          productName: product.name,
          productSku: item.productSku || product.sku,
          productImage: product.images?.[0] || '',
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
        });

        await queryRunner.manager.save(OrderItem, orderItem);

        // Deduct stock
        await this.stockService.adjustStock(
          item.productId,
          -item.quantity,
          `Commande manuelle (${data.source})`,
          orderNumber
        );
      }

      await queryRunner.commitTransaction();
      return await this.findOne(savedOrder.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
