import { Repository } from 'typeorm';
import { Order, Review } from '../../../database/entities';
import { StockService } from '../../../modules/stock/stock.service';
export declare class OrdersService {
    private orderRepository;
    private reviewRepository;
    private stockService;
    constructor(orderRepository: Repository<Order>, reviewRepository: Repository<Review>, stockService: StockService);
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
}
