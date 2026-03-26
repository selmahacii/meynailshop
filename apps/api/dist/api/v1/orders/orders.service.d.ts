import { Repository } from 'typeorm';
import { Order, Review, OrderItem, Product } from '../../../database/entities';
import { StockService } from '../../../modules/stock/stock.service';
import { DataSource } from 'typeorm';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private productRepository;
    private reviewRepository;
    private stockService;
    private dataSource;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, productRepository: Repository<Product>, reviewRepository: Repository<Review>, stockService: StockService, dataSource: DataSource);
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: Order[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Order>;
    updateStatus(id: string, status: string): Promise<Order>;
    getStats(): Promise<{
        total: number;
        active: number;
        history: number;
        pending: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        returned: number;
        totalRevenue: number;
        pendingReviews: number;
    } | {
        total: number;
        active: number;
        history: number;
        pending: number;
        delivered: number;
        cancelled: number;
        returned: number;
        totalRevenue: number;
        pendingReviews: number;
    }>;
    createManual(data: any): Promise<Order>;
}
