import { Repository } from 'typeorm';
import { Order } from '../../../database/entities/order.entity';
export declare class OrdersService {
    private orderRepository;
    constructor(orderRepository: Repository<Order>);
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
    }>;
}
