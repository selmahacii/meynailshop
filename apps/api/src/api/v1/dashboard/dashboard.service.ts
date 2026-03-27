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
    console.log('🚀 [DashboardService] Starting getMetrics');
    try {
      // 1. Current KPI calculations (Using subtotal to exclude shipping)
      const revenueQuery = await this.orderRepository
        .createQueryBuilder('o')
        .select('SUM(CASE WHEN o.status = \'delivered\' THEN o.subtotal ELSE 0 END)', 'totalRevenue')
        .addSelect('COUNT(o.id)', 'totalOrders')
        .addSelect('COUNT(CASE WHEN o.status = \'delivered\' THEN 1 END)', 'completedOrders')
        .addSelect('AVG(CASE WHEN o.status = \'delivered\' THEN o.subtotal END)', 'averageCart')
        .getRawOne()
        .catch(err => {
          console.error('❌ [DashboardService] Revenue query failed:', err);
          return null;
        });

      // 1.1 Profitability engine: Total Cost of Goods Sold (COGS)
      const cogsQuery = await this.orderItemRepository
        .createQueryBuilder('oi')
        .leftJoin('products', 'p', 'p.id = oi.productId')
        .leftJoin('orders', 'o', 'o.id = oi.orderId')
        .select('SUM(CASE WHEN o.status = \'delivered\' THEN oi.quantity * COALESCE(p."costPrice", 0) ELSE 0 END)', 'totalCogs')
        .getRawOne()
        .catch(err => {
            console.error('❌ [DashboardService] COGS calculation failed:', err);
            return { totalCogs: 0 };
        });

      // 1.2 Inventory metrics for Working Capital (Fond de Roulement)
      const inventoryQuery = await this.productRepository
        .createQueryBuilder('p')
        .select('SUM(p.stock * COALESCE(p."costPrice", 0))', 'inventoryValue')
        .getRawOne()
        .catch(() => ({ inventoryValue: 0 }));

      // 2. Previous month KPI calculations for deltas
      const lastMonthStart = new Date();
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      lastMonthStart.setDate(1);
      lastMonthStart.setHours(0, 0, 0, 0);

      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);

      const prevMonthQuery = await this.orderRepository
        .createQueryBuilder('o')
        .select('SUM(o.subtotal)', 'totalRevenue')
        .addSelect('COUNT(o.id)', 'totalOrders')
        .where('o.createdAt >= :start', { start: lastMonthStart })
        .andWhere('o.createdAt < :end', { end: thisMonthStart })
        .getRawOne()
        .catch(err => {
          console.error('❌ [DashboardService] Prev month query failed:', err);
          return null;
        });

      const totalRevenue = parseFloat(revenueQuery?.totalRevenue ?? '0') || 0;
      const totalOrders = parseInt(revenueQuery?.totalOrders ?? '0') || 0;
      const completedOrders = parseInt(revenueQuery?.completedOrders ?? '0') || 0;
      const averageCart = parseFloat(revenueQuery?.averageCart ?? '0') || 0;
      
      const prevRevenue = parseFloat(prevMonthQuery?.totalRevenue ?? '0') || 0;
      const prevOrders = parseInt(prevMonthQuery?.totalOrders ?? '0') || 0;

      // Get active clients
      const activeClients = await this.userRepository.count({
        where: { role: 'client', isActive: true },
      }).catch(err => {
        console.error('❌ [DashboardService] User count failed:', err);
        return 0;
      });

      const prevClients = await this.userRepository.count({
        where: { 
          role: 'client', 
          isActive: true,
          createdAt: LessThanOrEqual(lastMonthStart)
        },
      }).catch(err => {
        console.error('❌ [DashboardService] Prev user count failed:', err);
        return 0;
      });

      // 3. Fetch real data from optimized methods
      const monthlyRevenue = await this._getMonthlyTrendOptimized();
      const productSales = await this._getProductSales();
      const orderStatusBreakdown = await this._getOrderStatusBreakdownOptimized();
      const customerGrowth = await this._getCustomerGrowth();
      const lowStockProducts = await this._getLowStockProducts();
      const wilayaDistribution = await this._getWilayaDistribution();
      const paymentMethodDistribution = await this._getPaymentMethodDistribution();

      const totalCogs = parseFloat(cogsQuery?.totalCogs ?? '0') || 0;
      const profit = totalRevenue - totalCogs;
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      const inventoryValue = parseFloat(inventoryQuery?.inventoryValue ?? '0') || 0;

      return {
        kpis: {
          totalRevenue: totalRevenue || 0,
          totalProfit: Math.round(profit * 100) / 100,
          profitMargin: Math.round(margin * 10) / 10,
          inventoryValue: Math.round(inventoryValue * 100) / 100,
          prevRevenue: prevRevenue || 0,
          totalOrders: totalOrders || 0,
          prevOrders: prevOrders || 0,
          activeClients: activeClients || 0,
          prevClients: prevClients || 0,
          averageCart: Math.round(averageCart * 100) / 100,
          completedOrders: completedOrders,
          healthStatus: margin > 30 ? 'excellent' : margin > 15 ? 'good' : margin > 5 ? 'warning' : 'danger'
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
      return { error: error.message };
    }
  }

  private async _getMonthlyTrendOptimized(): Promise<any[]> {
    try {
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
        .select('order.subtotal', 'total')
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
    } catch (error) {
      console.warn('⚠️ [DashboardService] Monthly trend failed:', error.message);
      return [];
    }
  }

  private async _getOrderStatusBreakdownOptimized(): Promise<any[]> {
    try {
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

  private async _getProductSales(): Promise<any[]> {
    try {
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

  private async _getWilayaDistribution(): Promise<any[]> {
    try {
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
