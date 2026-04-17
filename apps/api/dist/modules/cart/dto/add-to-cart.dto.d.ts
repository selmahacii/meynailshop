export interface CartItem {
    productId: string;
    quantity: number;
    productName: string;
    productPrice: number;
    productImage: string;
    productSku: string;
    variantSku?: string;
    variantImage?: string;
    subtotal: number;
}
export declare class AddToCartDto {
    productId: string;
    quantity: number;
    variantSku?: string;
    variantImage?: string;
}
