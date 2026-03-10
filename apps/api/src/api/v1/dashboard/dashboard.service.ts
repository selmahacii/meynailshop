import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Order } from '../../../database/entities/order.entity';
import { Product } from '../../../database/entities/product.entity';
import { OrderItem } from '../../../database/entities/order-item.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getMetrics() {
    // Get total revenue
    const orders = await this.orderRepository.find({
      select: ['id', 'total', 'status', 'createdAt'],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;

    // Get active clients
    const activeClients = await this.userRepository.count({
      where: { role: 'client', isActive: true },
    });

    // Calculate average cart value
    const averageCart = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Get monthly revenue trend (last 6 months)
    const monthlyRevenue = this._getMonthlyTrend(orders);

    // Get product sales
    const productSales = await this._getProductSales();

    // Get order status breakdown
    const orderStatusBreakdown = this._getOrderStatusBreakdown(orders);

    // Get customer growth based on real client registrations
    const customerGrowth = await this._getCustomerGrowth();

    // Get low stock products
    const lowStockProducts = await this._getLowStockProducts();

    return {
      kpis: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orders.length,
        activeClients,
        averageCart: Math.round(averageCart * 100) / 100,
        completedOrders,
      },
      charts: {
        monthlyRevenue,
        productSales,
        orderStatusBreakdown,
        customerGrowth,
      },
      alerts: {
        lowStockProducts,
      },
    };
  }

  private _getMonthlyTrend(orders: any[]): any[] {
    const months: Array<{ name: string; revenue: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        revenue: 0,
      });
    }

    orders.forEach((order) => {
      if (order.status === 'delivered') {
        const orderDate = new Date(order.createdAt);
        const monthIndex = months.findIndex(
          (m) =>
            m.name ===
            orderDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        );
        if (monthIndex >= 0) {
          months[monthIndex].revenue += Number(order.total) || 0;
        }
      }
    });

    return months;
  }

  private async _getProductSales(): Promise<any[]> {
    const rows = await this.orderItemRepository
      .createQueryBuilder('item')
      .select('item.productName', 'name')
      .addSelect('SUM(item.quantity)', 'value')
      .groupBy('item.productName')
      .orderBy('value', 'DESC')
      .limit(5)
      .getRawMany<{ name: string; value: string }>();

    return rows.map((row) => ({
      name: row.name,
      value: Number(row.value) || 0,
    }));
  }

  private _getOrderStatusBreakdown(orders: any[]): any[] {
    const statuses: Record<string, number> = {
      pending: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.status as string;
      if (status === 'pending' || status === 'delivered' || status === 'cancelled') {
        statuses[status]++;
      }
    });

    return [
      { name: 'En attente', value: statuses.pending },
      { name: 'Livrées', value: statuses.delivered },
      { name: 'Annulées', value: statuses.cancelled },
    ];
  }

  private async _getCustomerGrowth(): Promise<any[]> {
    const months: Array<{ label: string; start: Date; end: Date }> = [];

    const now = new Date();
    // Build 6 last months windows [start, end)
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1, 0, 0, 0, 0);

      months.push({
        label: start.toLocaleDateString('fr-FR', { month: 'short' }),
        start,
        end,
      });
    }

    const earliestStart = months[0]?.start;
    // Use a query builder to avoid passing TypeORM operator objects as raw query
    const clients = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.createdAt'])
      .where('u.role = :role', { role: 'client' })
      .andWhere('u.createdAt >= :earliestStart', { earliestStart: earliestStart.toISOString() })
      .getMany();

    return months.map((m) => {
      const count = clients.filter(
        (c) => c.createdAt >= m.start && c.createdAt < m.end,
      ).length;

      return {
        month: m.label,
        customers: count,
      };
    });
  }

  private async _getLowStockProducts(): Promise<any[]> {
    const products = await this.productRepository.find({
      where: {
        stock: LessThanOrEqual(10),
        isActive: true,
      },
      order: { stock: 'ASC' },
      take: 5,
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      sku: p.sku,
    }));
  }
}
