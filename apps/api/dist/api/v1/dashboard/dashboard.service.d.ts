import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Order } from '../../../database/entities/order.entity';
import { Product } from '../../../database/entities/product.entity';
import { OrderItem } from '../../../database/entities/order-item.entity';
export declare class DashboardService {
    private userRepository;
    private orderRepository;
    private productRepository;
    private orderItemRepository;
    constructor(userRepository: Repository<User>, orderRepository: Repository<Order>, productRepository: Repository<Product>, orderItemRepository: Repository<OrderItem>);
    getMetrics(): Promise<{
        kpis: {
            totalRevenue: number;
            totalOrders: number;
            activeClients: number;
            averageCart: number;
            completedOrders: number;
        };
        charts: {
            monthlyRevenue: any[];
            productSales: any[];
            orderStatusBreakdown: any[];
            customerGrowth: any[];
        };
        alerts: {
            lowStockProducts: any[];
        };
    }>;
    private _getMonthlyTrend;
    private _getProductSales;
    private _getOrderStatusBreakdown;
    private _getCustomerGrowth;
    private _getLowStockProducts;
}
