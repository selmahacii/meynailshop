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

  async getMetrics(range: string = 'all') {
    console.log(`🚀 [DashboardService] Starting getMetrics for range: ${range}`);
    try {
      // Determine Current and Previous periods
      const now = new Date();
      let startDate: Date | null = null;
      let prevStartDate: Date | null = null;
      let prevEndDate: Date | null = null;

      if (range === '7d') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        prevEndDate = startDate;
      } else if (range === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        prevEndDate = startDate;
      }

      // 1. Current KPI calculations
      const revenueQueryBuilder = this.orderRepository
        .createQueryBuilder('o')
        .select(`SUM(CASE 
          WHEN o.status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN o.subtotal 
          ELSE 0 
        END)`, 'totalRevenue')
        .addSelect('COUNT(o.id)', 'totalOrders')
        .addSelect("COUNT(CASE WHEN o.status = 'delivered' THEN 1 END)", 'completedOrders')
        .addSelect(`AVG(CASE 
          WHEN o.status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN o.subtotal 
        END)`, 'averageCart');

      if (startDate) {
        revenueQueryBuilder.where('o.createdAt >= :start', { start: startDate });
      }

      const revenueQuery = await revenueQueryBuilder.getRawOne().catch(err => {
        console.error('❌ [DashboardService] Revenue query failed:', err);
        return null;
      });

      // 1.1 COGS for profitability in the selected period
      const cogsQueryBuilder = this.orderItemRepository
        .createQueryBuilder('oi')
        .leftJoin('products', 'p', 'p.id = oi.productId')
        .leftJoin('orders', 'o', 'o.id = oi.orderId')
        .select('SUM(CASE WHEN o.status IN (\'confirmed\', \'processing\', \'shipped\', \'delivered\') THEN oi.quantity * COALESCE(p."costPrice", 0) ELSE 0 END)', 'totalCogs');

      if (startDate) {
        cogsQueryBuilder.where('o.createdAt >= :start', { start: startDate });
      }
      const cogsQuery = await cogsQueryBuilder.getRawOne().catch(() => ({ totalCogs: 0 }));

      // 1.2 Inventory metrics (Real-time calculation including Variants)
      const allActiveProducts = await this.productRepository.find({ where: { isActive: true } });
      const inventoryData = allActiveProducts.reduce((sum, p) => {
        const cost = Number(p.costPrice) || 0;
        if (!p.hasVariants) {
          return sum + (p.stock * cost);
        } else if (p.variants && Array.isArray(p.variants)) {
          const variantStock = p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
          return sum + (variantStock * cost);
        }
        return sum;
      }, 0);

      // 2. Previous range comparison for Deltas
      let prevRevenue = 0;
      let prevOrders = 0;
      if (prevStartDate && prevEndDate) {
        const prevQuery = await this.orderRepository
          .createQueryBuilder('o')
          .select('SUM(o.subtotal)', 'revenue')
          .addSelect('COUNT(o.id)', 'orders')
          .where('o.createdAt >= :start AND o.createdAt < :end', { start: prevStartDate, end: prevEndDate })
          .getRawOne();
        prevRevenue = parseFloat(prevQuery?.revenue ?? '0') || 0;
        prevOrders = parseInt(prevQuery?.orders ?? '0') || 0;
      }

      const totalRevenue = parseFloat(revenueQuery?.totalRevenue ?? '0') || 0;
      const totalOrders = parseInt(revenueQuery?.totalOrders ?? '0') || 0;
      const averageCart = parseFloat(revenueQuery?.averageCart ?? '0') || 0;
      const activeClients = await this.userRepository.createQueryBuilder('u').where('u.role = :role', { role: 'client' }).getCount();

      // 3. Trends & Distributions
      const trendGranularity = (range === '7d' || range === '30d') ? 'daily' : 'monthly';
      const monthlyRevenue = await this._getTrend(range, trendGranularity);
      
      const productSales = await this._getProductSales(startDate);
      const orderStatusBreakdown = await this._getOrderStatusBreakdownOptimized(startDate);
      const lowStockProducts = await this._getLowStockProducts();
      const wilayaDistribution = await this._getWilayaDistribution(startDate);

      // Profitability (Estimated)
      const profit = totalRevenue * 0.45; 
      const margin = 45;

      return {
        kpis: {
          totalRevenue,
          totalProfit: Math.round(profit * 100) / 100,
          profitMargin: margin,
          inventoryValue: Math.round(inventoryData * 100) / 100, 
          prevRevenue,
          totalOrders,
          prevOrders,
          activeClients,
          averageCart: Math.round(averageCart * 100) / 100,
          healthStatus: 'good'
        },
        charts: {
          monthlyRevenue,
          productSales,
          orderStatusBreakdown,
          wilayaDistribution,
        },
        alerts: {
          lowStockProducts,
        },
      };
    } catch (error) {
      console.error('❌ [DashboardService] getMetrics Error:', error);
      return { error: error.message };
    }
  }

  private async _getTrend(range: string, granularity: 'daily' | 'monthly'): Promise<any[]> {
    try {
      const data: any[] = [];
      const now = new Date();
      const count = range === '7d' ? 7 : range === '30d' ? 30 : 6;
      
      for (let i = count - 1; i >= 0; i--) {
        const date = granularity === 'daily' 
          ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
          : new Date(now.getFullYear(), now.getMonth() - i, 1);
        
        const label = granularity === 'daily'
          ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          : date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });

        data.push({ name: label, revenue: 0, dateStart: date });
      }

      const orders = await this.orderRepository
        .createQueryBuilder('o')
        .select(['o.subtotal', 'o.createdAt'])
        .where("o.status IN ('confirmed', 'processing', 'shipped', 'delivered')")
        .andWhere('o.createdAt >= :start', { start: data[0].dateStart })
        .getMany();

      orders.forEach(order => {
        const d = new Date(order.createdAt);
        const label = granularity === 'daily'
          ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          : d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        
        const point = data.find(p => p.name === label);
        if (point) point.revenue += Number(order.subtotal) || 0;
      });

      return data.map(p => ({ name: p.name, revenue: Math.round(p.revenue) }));
    } catch (error) {
      return [];
    }
  }

  private async _getOrderStatusBreakdownOptimized(startDate?: Date | null): Promise<any[]> {
    try {
      const query = this.orderRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(order.id)', 'count');
      
      if (startDate) query.where('order.createdAt >= :start', { start: startDate });

      const stats = await query.groupBy('order.status').getRawMany();

      const mapping: Record<string, string> = {
        pending: 'En attente',
        processing: 'En cours',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
        returned: 'Retournée',
      };

      return stats.map(s => ({
        name: mapping[s.status] || s.status,
        value: parseInt(s.count) || 0,
      }));
    } catch (error) {
      console.warn('⚠️ [DashboardService] Order breakdown failed:', error.message);
      return [];
    }
  }

  private async _getProductSales(startDate?: Date | null): Promise<any[]> {
    try {
      const query = this.orderItemRepository
        .createQueryBuilder('item')
        .leftJoin('orders', 'o', 'o.id = item.orderId')
        .select('item.productName', 'name')
        .addSelect('SUM(item.quantity)', 'value');
      
      if (startDate) query.where('o.createdAt >= :start', { start: startDate });

      const rows = await query
        .groupBy('item.productName')
        .orderBy('SUM(item.quantity)', 'DESC')
        .limit(5)
        .getRawMany();

      return rows.map((row) => ({
        name: row.name,
        value: parseInt(row.value) || 0,
      }));
    } catch (error) {
      console.warn('⚠️ [DashboardService] Product sales failed:', error.message);
      return [];
    }
  }

  private async _getCustomerGrowth(): Promise<any[]> {
    try {
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
        customers: clients.filter((c) => {
          const createdAt = new Date(c.createdAt);
          return createdAt >= m.start && createdAt < m.end;
        }).length,
      }));
    } catch (error) {
      console.warn('⚠️ [DashboardService] Customer growth failed:', error.message);
      return [];
    }
  }

  private async _getLowStockProducts(): Promise<any[]> {
    try {
      const allProducts = await this.productRepository
        .createQueryBuilder('p')
        .where('p.isActive = :isActive', { isActive: true })
        .andWhere('(p.stock <= p."stockAlert" OR p."hasVariants" = true)')
        .getMany();
        
      const results: any[] = [];
      const DEFAULT_ALERT = 5;

      for (const p of allProducts) {
        if (!p.hasVariants) {
          // Normal product logic
          if (p.stock <= (p.stockAlert || DEFAULT_ALERT)) {
            results.push({ id: p.id, name: p.name, stock: p.stock, sku: p.sku, isVariant: false });
          }
        } else if (p.variants && Array.isArray(p.variants)) {
          // Variant logic: Each variant below its alert threshold counts as an entry
          for (const v of p.variants) {
            const threshold = v.stockAlert || p.stockAlert || DEFAULT_ALERT;
            if (v.stock <= threshold) {
              results.push({ 
                id: `${p.id}-${v.sku}`, 
                name: `${p.name} (${v.sku})`, 
                stock: v.stock, 
                sku: v.sku, 
                isVariant: true,
                productId: p.id 
              });
            }
          }
        }
      }

      // Sort by stock ascending and limit to 10 for dashboard (increased from 5 for granularity)
      return results.sort((a, b) => a.stock - b.stock).slice(0, 10);
    } catch (error) {
      console.warn('⚠️ [DashboardService] Low stock products failed:', error.message);
      return [];
    }
  }

  private async _getWilayaDistribution(startDate?: Date | null): Promise<any[]> {
    try {
      const query = `
        SELECT 
          COALESCE("shippingAddressSnapshot"->>'wilayaCode', "shippingAddressSnapshot"->>'wilaya') as "wilayaCode",
          COALESCE("shippingAddressSnapshot"->>'wilayaName', "shippingAddressSnapshot"->>'wilaya') as "wilayaName",
          COUNT(*) as "count"
        FROM "orders"
        WHERE "createdAt" >= $1 OR $1 IS NULL
        GROUP BY 1, 2
        ORDER BY "count" DESC
        LIMIT 5
      `;
      const rawData = await this.orderRepository.query(query, [startDate?.toISOString() || null]);

      if (!rawData || !Array.isArray(rawData)) return [];

      const total = rawData.reduce((sum: number, s: any) => sum + (parseInt(s.count) || 0), 0);
      return rawData.map((s: any) => {
        const count = parseInt(s.count) || 0;
        return {
          wilaya: s.wilayaName || s.wilayaCode || 'Inconnue',
          count,
          percent: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      });
    } catch (error) {
      console.warn('⚠️ [DashboardService] Wilaya distribution failed:', error.message);
      return [];
    }
  }

  private async _getPaymentMethodDistribution(): Promise<any[]> {
    try {
      const stats = await this.orderRepository
        .createQueryBuilder('order')
        .select('order.paymentMethod', 'method')
        .addSelect('COUNT(order.id)', 'count')
        .groupBy('order.paymentMethod')
        .getRawMany();

      const mapping: Record<string, string> = {
        cash_on_delivery: 'Main à main',
        baridimob: 'Baridimob',
        ccp: 'CCP',
      };

      const total = stats.reduce((sum, s) => sum + (parseInt(s.count) || 0), 0);
      return stats.map(s => {
        const count = parseInt(s.count) || 0;
        return {
          name: mapping[s.method] || s.method || 'Inconnu',
          value: count,
          percent: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      });
    } catch (error) {
      console.warn('⚠️ [DashboardService] Payment distribution failed:', error.message);
      return [];
    }
  }
}
