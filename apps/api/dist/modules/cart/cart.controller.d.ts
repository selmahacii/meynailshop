import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(user: any): Promise<{
        statusCode: number;
        data: {
            items: never[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            total: number;
            couponCode?: undefined;
        } | {
            items: import("./cart.service").CartItem[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            couponCode: string | undefined;
            total: number;
        };
    }>;
    getCartItems(user: any): Promise<{
        statusCode: number;
        data: {
            items: import("./cart.service").CartItem[];
            count: number;
        };
    }>;
    getCartCount(user: any): Promise<{
        statusCode: number;
        data: {
            count: number;
        };
    }>;
    addItem(user: any, addToCartDto: AddToCartDto): Promise<{
        statusCode: number;
        message: string;
        data: import("./cart.service").CartItem;
    }>;
    updateItem(user: any, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        statusCode: number;
        message: string;
        data: import("./cart.service").CartItem;
    }>;
    removeItem(user: any, productId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    applyCoupon(user: any, body: {
        couponCode: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
            items: never[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            total: number;
            couponCode?: undefined;
        } | {
            items: import("./cart.service").CartItem[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            couponCode: string | undefined;
            total: number;
        };
    }>;
    removeCoupon(user: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            items: never[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            total: number;
            couponCode?: undefined;
        } | {
            items: import("./cart.service").CartItem[];
            itemCount: number;
            subtotal: number;
            tax: number;
            shippingCost: number;
            couponDiscount: number;
            couponCode: string | undefined;
            total: number;
        };
    }>;
    clearCart(user: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    validateCart(user: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            valid: boolean;
            summary?: undefined;
        };
    } | {
        statusCode: number;
        message: string;
        data: {
            valid: boolean;
            summary: {
                items: never[];
                itemCount: number;
                subtotal: number;
                tax: number;
                shippingCost: number;
                couponDiscount: number;
                total: number;
                couponCode?: undefined;
            } | {
                items: import("./cart.service").CartItem[];
                itemCount: number;
                subtotal: number;
                tax: number;
                shippingCost: number;
                couponDiscount: number;
                couponCode: string | undefined;
                total: number;
            };
        };
    }>;
}
