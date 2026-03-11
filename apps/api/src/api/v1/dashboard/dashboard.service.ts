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
    // 1. Scalable KPI calculations using aggregations
    const revenueQuery = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(CAST(order.total AS DECIMAL))', 'totalRevenue')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('COUNT(CASE WHEN order.status = \'delivered\' THEN 1 END)', 'completedOrders')
      .addSelect('AVG(CAST(order.total AS DECIMAL))', 'averageCart')
      .getRawOne();

    const totalRevenue = parseFloat(revenueQuery.totalRevenue) || 0;
    const totalOrders = parseInt(revenueQuery.totalOrders) || 0;
    const completedOrders = parseInt(revenueQuery.completedOrders) || 0;
    const averageCart = parseFloat(revenueQuery.averageCart) || 0;

    // Get active clients
    const activeClients = await this.userRepository.count({
      where: { role: 'client', isActive: true },
    });

    // 2. Optimized Monthly Trend (Last 6 months)
    const monthlyRevenue = await this._getMonthlyTrendOptimized();

    // 3. Product Sales (Already using QueryBuilder)
    const productSales = await this._getProductSales();

    // 4. Order Status Breakdown
    const orderStatusBreakdown = await this._getOrderStatusBreakdownOptimized();

    // 5. Customer Growth (Already using QueryBuilder)
    const customerGrowth = await this._getCustomerGrowth();

    // 6. Low stock products
    const lowStockProducts = await this._getLowStockProducts();

    // 7. New Business KPIs
    const wilayaDistribution = await this._getWilayaDistribution();
    const paymentMethodDistribution = await this._getPaymentMethodDistribution();

    return {
      kpis: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: totalOrders,
        activeClients,
        averageCart: Math.round(averageCart * 100) / 100,
        completedOrders,
      },
      charts: {
        monthlyRevenue,
        productSales,
        orderStatusBreakdown,
        customerGrowth,
        wilayaDistribution,
        paymentMethodDistribution,
      },
      alerts: {
        lowStockProducts,
      },
    };
  }

  private async _getMonthlyTrendOptimized(): Promise<any[]> {
    const months: Array<{ name: string; revenue: number; start: string; end: string }> = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      months.push({
        name: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        revenue: 0,
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }

    const trend = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(CAST(order.total AS DECIMAL))', 'revenue')
      .addSelect("TO_CHAR(order.createdAt, 'Mon YY')", 'monthYear')
      .where('order.status = :status', { status: 'delivered' })
      .andWhere('order.createdAt >= :start', { start: months[0].start })
      .groupBy("TO_CHAR(order.createdAt, 'Mon YY')")
      .getRawMany();

    // Mapping manual since Postgres TO_CHAR might differ slightly from JS toLocaleDateString
    // But for 5-6 values, a nested loop or find is fine.
    // However, let's just use the JS logic to match the bucket exactly
    const dataByMonth = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.total', 'total')
      .addSelect('order.createdAt', 'createdAt')
      .where('order.status = :status', { status: 'delivered' })
      .andWhere('order.createdAt >= :start', { start: months[0].start })
      .getRawMany();

    dataByMonth.forEach(row => {
      const date = new Date(row.createdAt);
      const label = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const month = months.find(m => m.name === label);
      if (month) {
        month.revenue += parseFloat(row.total) || 0;
      }
    });

    return months.map(m => ({ name: m.name, revenue: Math.round(m.revenue * 100) / 100 }));
  }

  private async _getOrderStatusBreakdownOptimized(): Promise<any[]> {
    const stats = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const mapping: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };

    return stats.map(s => ({
      name: mapping[s.status] || s.status,
      value: parseInt(s.count) || 0,
    }));
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

  private async _getWilayaDistribution(): Promise<any[]> {
    const stats = await this.orderRepository
      .createQueryBuilder('order')
      .select("order.shippingAddressSnapshot->>'wilaya' || ' - ' || (order.shippingAddressSnapshot->>'wilayaName')", 'wilaya')
      .addSelect('COUNT(order.id)', 'count')
      .where("order.shippingAddressSnapshot->>'wilaya' IS NOT NULL")
      .groupBy("order.shippingAddressSnapshot->>'wilaya'")
      .addGroupBy("order.shippingAddressSnapshot->>'wilayaName'")
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    const total = stats.reduce((sum, s) => sum + parseInt(s.count), 0);
    
    return stats.map(s => ({
      wilaya: s.wilaya || 'Inconnue',
      count: parseInt(s.count) || 0,
      percent: total > 0 ? Math.round((parseInt(s.count) / total) * 100) : 0,
    }));
  }

  private async _getPaymentMethodDistribution(): Promise<any[]> {
    const stats = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.paymentMethod', 'method')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.paymentMethod')
      .getRawMany();

    const mapping: Record<string, string> = {
      cash_on_delivery: 'À la livraison',
      baridimob: 'Baridimob',
      ccp: 'CCP',
    };

    const total = stats.reduce((sum, s) => sum + parseInt(s.count), 0);

    return stats.map(s => ({
      name: mapping[s.method] || s.method,
      value: parseInt(s.count) || 0,
      percent: total > 0 ? Math.round((parseInt(s.count) / total) * 100) : 0,
    }));
  }
}
