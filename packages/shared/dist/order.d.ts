import { OrderStatus, PaymentStatus, PaymentMethod } from './api';
import { Address } from './user';
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productSku: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}
export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingAddressSnapshot: Partial<Address>;
    notes: string | null;
    trackingNumber: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface OrderResponse extends Order {
    items?: OrderItem[];
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}
export interface CreateOrderDto {
    addressId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}
export interface UpdateOrderStatusDto {
    status: OrderStatus;
    trackingNumber?: string;
}
export interface OrderLineItem {
    productId: string;
    quantity: number;
    unitPrice: number;
}
//# sourceMappingURL=order.d.ts.map