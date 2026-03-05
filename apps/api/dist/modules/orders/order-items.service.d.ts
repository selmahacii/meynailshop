import { Repository } from 'typeorm';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
export declare class OrderItemsService {
    private orderItemRepository;
    private orderRepository;
    constructor(orderItemRepository: Repository<OrderItem>, orderRepository: Repository<Order>);
    findByOrderId(orderId: string): Promise<OrderItem[]>;
    findOne(id: string): Promise<OrderItem>;
    countByProductId(productId: string): Promise<number>;
    getTotalSalesByProductId(productId: string): Promise<number>;
    getProductRevenue(productId: string): Promise<number>;
    getOrderItemsStats(orderId: string): Promise<{
        itemCount: number;
        totalQuantity: number;
        totalValue: number;
        items: OrderItem[];
    }>;
}
