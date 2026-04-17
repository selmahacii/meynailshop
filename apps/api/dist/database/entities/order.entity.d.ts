import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: string;
    orderNumber: string;
    userId: string;
    deliveryType: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    shippingCost: number;
    returnCost: number;
    discount: number;
    total: number;
    shippingAddressSnapshot: any;
    notes: string;
    trackingNumber: string;
    shippedAt: Date;
    deliveredAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    items: OrderItem[];
}
