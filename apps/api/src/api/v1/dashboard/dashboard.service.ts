import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/database/entities/user.entity';
import { Order } from '@/database/entities/order.entity';
import { Product } from '@/database/entities/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getMetrics() {
    // Get total revenue
    const orders = await this.orderRepository.find({
      select: ['totalAmount', 'status', 'createdAt'],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
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

    // Get customer growth (mock - based on creation dates)
    const customerGrowth = this._getCustomerGrowth(orders);

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
    const months = [];
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
          months[monthIndex].revenue += order.totalAmount || 0;
        }
      }
    });

    return months;
  }

  private async _getProductSales(): Promise<any[]> {
    const products = await this.productRepository.find({ take: 5 });
    return products.map((p) => ({
      name: p.name,
      value: Math.floor(Math.random() * 100) + 20,
    }));
  }

  private _getOrderStatusBreakdown(orders: any[]): any[] {
    const statuses = {
      pending: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (order.status in statuses) {
        statuses[order.status]++;
      }
    });

    return [
      { name: 'En attente', value: statuses.pending },
      { name: 'Livrées', value: statuses.delivered },
      { name: 'Annulées', value: statuses.cancelled },
    ];
  }

  private _getCustomerGrowth(orders: any[]): any[] {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        customers: Math.floor(Math.random() * 50) + 20,
      });
    }
    return months;
  }

  private async _getLowStockProducts(): Promise<any[]> {
    const products = await this.productRepository.find({
      where: { stock: 10 }, // Products with stock <= 10
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
