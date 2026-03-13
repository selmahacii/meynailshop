declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    addressId?: string;
    deliveryType: 'home' | 'office';
    paymentMethod: 'cash_on_delivery' | 'ccp' | 'baridimob';
    notes?: string;
    couponCode?: string;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
        wilaya: string;
        commune: string;
    };
    items?: OrderItemDto[];
}
export {};
