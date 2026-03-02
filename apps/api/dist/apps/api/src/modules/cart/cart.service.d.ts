import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Product } from '../../database/entities/product.entity';
import { Coupon } from '../../database/entities/coupon.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export interface CartItem {
    productId: string;
    quantity: number;
    productName: string;
    productPrice: number;
    productImage: string;
    productSku: string;
    subtotal: number;
}
export interface CartData {
    items: CartItem[];
    couponCode?: string;
    couponDiscount?: number;
    shippingCost?: number;
    tax?: number;
}
export declare class CartService {
    private cacheManager;
    private productRepository;
    private couponRepository;
    private readonly CART_TTL;
    private readonly CART_PREFIX;
    constructor(cacheManager: Cache, productRepository: Repository<Product>, couponRepository: Repository<Coupon>);
    private getCartKey;
    addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartItem>;
    updateItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem>;
    removeItem(userId: string, productId: string): Promise<void>;
    getCart(userId: string): Promise<CartData | null>;
    getCartItems(userId: string): Promise<CartItem[]>;
    clearCart(userId: string): Promise<void>;
    applyCoupon(userId: string, couponCode: string): Promise<CartData>;
    removeCoupon(userId: string): Promise<CartData>;
    calculateSubtotal(items: CartItem[]): number;
    calculateTax(subtotal: number, taxRate?: number): number;
    getCartSummary(userId: string): Promise<{
        items: never[];
        itemCount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        couponDiscount: number;
        total: number;
        couponCode?: undefined;
    } | {
        items: CartItem[];
        itemCount: number;
        subtotal: number;
        tax: number;
        shippingCost: number;
        couponDiscount: number;
        couponCode: string | undefined;
        total: number;
    }>;
    exists(userId: string): Promise<boolean>;
    getCartSize(userId: string): Promise<number>;
}
