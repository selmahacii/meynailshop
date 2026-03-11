import { Repository } from 'typeorm';
import { Order, Review } from '../../../database/entities';
export declare class OrdersService {
    private orderRepository;
    private reviewRepository;
    constructor(orderRepository: Repository<Order>, reviewRepository: Repository<Review>);
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
        pending: number;
        delivered: number;
        cancelled: number;
        totalRevenue: number;
        pendingReviews: number;
    }>;
}
