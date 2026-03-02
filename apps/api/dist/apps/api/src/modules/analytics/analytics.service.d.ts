import { Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { Product } from '../../database/entities/product.entity';
export declare class AnalyticsService {
    private orderRepository;
    private productRepository;
    constructor(orderRepository: Repository<Order>, productRepository: Repository<Product>);
    getDashboard(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        activeProducts: number;
        timestamp: Date;
    }>;
    getSalesByPeriod(days: number): Promise<Order[]>;
}
