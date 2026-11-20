declare class OrderItemDto {
    productId?: string;
    quantity: number;
    unitPrice?: number;
    productName?: string;
    productImage?: string;
    variantSku?: string;
    variantImage?: string;
}
export declare class CreateOrderDto {
    addressId?: string;
    deliveryType: 'home' | 'office';
    paymentMethod: 'cash_on_delivery' | 'ccp' | 'baridimob';
    notes?: string;
    source?: string;
    couponCode?: string;
    shippingAddress?: any;
    items?: OrderItemDto[];
}
export {};
