import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingAddressSnapshot: any;
    notes: string;
    trackingNumber: string;
    shippedAt: Date;
    deliveredAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    items: OrderItem[];
}
