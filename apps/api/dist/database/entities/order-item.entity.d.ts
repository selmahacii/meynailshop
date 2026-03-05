import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    productSku: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    order: Order;
}
