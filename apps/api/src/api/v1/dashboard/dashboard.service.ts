import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { User, Order, Product, OrderItem } from '../../../database/entities';

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
    try {
      // 1. KPI calculations
      const revenueQuery = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'totalRevenue')
        .addSelect('COUNT(order.id)', 'totalOrders')
        .addSelect('COUNT(CASE WHEN order.status = \'delivered\' THEN 1 END)', 'completedOrders')
        .addSelect('AVG(order.total)', 'averageCart')
        .getRawOne();

      const totalRevenue = parseFloat(revenueQuery?.totalRevenue ?? '0') || 0;
      const totalOrders = parseInt(revenueQuery?.totalOrders ?? '0') || 0;
      const completedOrders = parseInt(revenueQuery?.completedOrders ?? '0') || 0;
      const averageCart = parseFloat(revenueQuery?.averageCart ?? '0') || 0;

      // Get active clients
      const activeClients = await this.userRepository.count({
        where: { role: 'client', isActive: true },
      });

      // 2. Fetch real data from optimized methods
      const monthlyRevenue = await this._getMonthlyTrendOptimized();
      const productSales = await this._getProductSales();
      const orderStatusBreakdown = await this._getOrderStatusBreakdownOptimized();
      const customerGrowth = await this._getCustomerGrowth();
      const lowStockProducts = await this._getLowStockProducts();
      const wilayaDistribution = await this._getWilayaDistribution();
      const paymentMethodDistribution = await this._getPaymentMethodDistribution();

      return {
        kpis: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders: totalOrders,
          activeClients: activeClients,
          averageCart: Math.round(averageCart * 100) / 100,
          completedOrders: completedOrders,
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
    } catch (error) {
      console.error('❌ [DashboardService] getMetrics Error:', error);
      throw error;
    }
  }

  private async _getMonthlyTrendOptimized(): Promise<any[]> {
    const months: Array<{ name: string; revenue: number; start: string }> = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        revenue: 0,
        start: start.toISOString(),
      });
    }

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
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(5)
      .getRawMany();

    return rows.map((row) => ({
      name: row.name,
      value: parseInt(row.value) || 0,
    }));
  }

  private async _getCustomerGrowth(): Promise<any[]> {
    const months: Array<{ label: string; start: Date; end: Date }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1, 0, 0, 0, 0);
      months.push({ label: start.toLocaleDateString('fr-FR', { month: 'short' }), start, end });
    }

    const clients = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.createdAt'])
      .where('u.role = :role', { role: 'client' })
      .andWhere('u.createdAt >= :start', { start: months[0].start.toISOString() })
      .getMany();

    return months.map((m) => ({
      month: m.label,
      customers: clients.filter((c) => c.createdAt >= m.start && c.createdAt < m.end).length,
    }));
  }

  private async _getLowStockProducts(): Promise<any[]> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .where('p.stock <= :limit', { limit: 10 })
      .andWhere('p.isActive = :isActive', { isActive: true })
      .orderBy('p.stock', 'ASC')
      .limit(5)
      .getMany();
      
    return products.map((p) => ({ id: p.id, name: p.name, stock: p.stock, sku: p.sku }));
  }

  private async _getWilayaDistribution(): Promise<any[]> {
    // Using raw SQL for JSONB aggregations to avoid QueryBuilder inconsistencies
    const rawData = await this.orderRepository.query(`
      SELECT 
        "shippingAddressSnapshot"->>'wilaya' as "wilayaCode",
        "shippingAddressSnapshot"->>'wilayaName' as "wilayaName",
        COUNT(*) as "count"
      FROM "orders"
      WHERE "shippingAddressSnapshot"->>'wilaya' IS NOT NULL
      GROUP BY "shippingAddressSnapshot"->>'wilaya', "shippingAddressSnapshot"->>'wilayaName'
      ORDER BY "count" DESC
      LIMIT 5
    `);

    const total = rawData.reduce((sum: number, s: any) => sum + (parseInt(s.count) || 0), 0);
    return rawData.map((s: any) => {
      const count = parseInt(s.count) || 0;
      return {
        wilaya: s.wilayaName || s.wilayaCode || 'Inconnue',
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
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

    const total = stats.reduce((sum, s) => sum + (parseInt(s.count) || 0), 0);
    return stats.map(s => ({
      name: mapping[s.method] || s.method,
      value: parseInt(s.count) || 0,
      percent: total > 0 ? Math.round((parseInt(s.count) / total) * 100) : 0,
    }));
  }
}
