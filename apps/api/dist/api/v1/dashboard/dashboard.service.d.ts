import { Repository } from 'typeorm';
import { User, Order, Product, OrderItem } from '../../../database/entities';
export declare class DashboardService {
    private userRepository;
    private orderRepository;
    private productRepository;
    private orderItemRepository;
    constructor(userRepository: Repository<User>, orderRepository: Repository<Order>, productRepository: Repository<Product>, orderItemRepository: Repository<OrderItem>);
    getMetrics(): Promise<{
        kpis: {
            totalRevenue: number;
            prevRevenue: number;
            totalOrders: number;
            prevOrders: number;
            activeClients: number;
            prevClients: number;
            averageCart: number;
            completedOrders: number;
        };
        charts: {
            monthlyRevenue: any[];
            productSales: any[];
            orderStatusBreakdown: any[];
            customerGrowth: any[];
            wilayaDistribution: any[];
            paymentMethodDistribution: any[];
        };
        alerts: {
            lowStockProducts: any[];
        };
    }>;
    private _getMonthlyTrendOptimized;
    private _getOrderStatusBreakdownOptimized;
    private _getProductSales;
    private _getCustomerGrowth;
    private _getLowStockProducts;
    private _getWilayaDistribution;
    private _getPaymentMethodDistribution;
}
