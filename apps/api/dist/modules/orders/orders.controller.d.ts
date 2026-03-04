import { OrdersService } from './orders.service';
import { OrderItemsService } from './order-items.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
export declare class OrdersController {
    private ordersService;
    private orderItemsService;
    private cartService;
    constructor(ordersService: OrdersService, orderItemsService: OrderItemsService, cartService: CartService);
    create(user: any, createOrderDto: CreateOrderDto): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Order;
    }>;
    findAll(user: any, query: OrdersQueryDto): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<import("../../database/entities").Order>;
    }>;
    getStats(user: any): Promise<{
        statusCode: number;
        data: {
            totalOrders: number;
            completedOrders: number;
            pendingOrders: number;
            cancelledOrders: number;
            totalRevenue: number;
        };
    }>;
    findOne(user: any, id: string): Promise<{
        statusCode: number;
        data: import("../../database/entities").Order;
    }>;
    getOrderItems(user: any, id: string): Promise<{
        statusCode: number;
        data: {
            items: import("../../database/entities").OrderItem[];
            stats: {
                itemCount: number;
                totalQuantity: number;
                totalValue: number;
                items: import("../../database/entities").OrderItem[];
            };
        };
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Order;
    }>;
    cancelOrder(user: any, id: string, body: {
        reason: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Order;
    }>;
    getTrackingInfo(user: any, id: string): Promise<{
        statusCode: number;
        data: {
            orderNumber: string;
            status: string;
            trackingNumber: string;
            shippedAt: Date;
            deliveredAt: Date;
        };
    }>;
}
