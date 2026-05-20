import { Repository } from 'typeorm';
import { User, Order, Product, OrderItem } from '../../../database/entities';
export declare class DashboardService {
    private userRepository;
    private orderRepository;
    private productRepository;
    private orderItemRepository;
    constructor(userRepository: Repository<User>, orderRepository: Repository<Order>, productRepository: Repository<Product>, orderItemRepository: Repository<OrderItem>);
    getMetrics(range?: string): Promise<{
        kpis: {
            totalRevenue: number;
            totalProfit: number;
            profitMargin: number;
            inventoryValue: number;
            prevRevenue: number;
            totalOrders: number;
            prevOrders: number;
            activeClients: number;
            averageCart: number;
            healthStatus: string;
        };
        charts: {
            monthlyRevenue: any[];
            productSales: any[];
            orderStatusBreakdown: any[];
            wilayaDistribution: any[];
        };
        alerts: {
            lowStockProducts: any[];
        };
        error?: undefined;
    } | {
        error: any;
        kpis?: undefined;
        charts?: undefined;
        alerts?: undefined;
    }>;
    private _getTrend;
    private _getOrderStatusBreakdownOptimized;
    private _getProductSales;
    private _getCustomerGrowth;
    private _getLowStockProducts;
    private _getWilayaDistribution;
    private _getPaymentMethodDistribution;
}
