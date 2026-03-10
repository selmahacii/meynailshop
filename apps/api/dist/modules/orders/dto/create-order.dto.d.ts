export declare class CreateOrderDto {
    addressId: string;
    paymentMethod: 'cash_on_delivery' | 'ccp' | 'baridimob';
    notes?: string;
    couponCode?: string;
}
