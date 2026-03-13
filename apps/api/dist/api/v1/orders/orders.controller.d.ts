import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(page: string, limit: string, status: string): Promise<{
        success: boolean;
        data: {
            data: import("../../../database/entities").Order[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
    }>;
    getStats(): Promise<{
        success: boolean;
        data: {
            total: number;
            pending: number;
            shipped: number;
            delivered: number;
            cancelled: number;
            returned: number;
            totalRevenue: number;
            pendingReviews: number;
        } | {
            total: number;
            pending: number;
            delivered: number;
            cancelled: number;
            returned: number;
            totalRevenue: number;
            pendingReviews: number;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../../../database/entities").Order;
    }>;
    updateStatus(id: string, { status }: any): Promise<{
        success: boolean;
        data: import("../../../database/entities").Order;
    }>;
}
