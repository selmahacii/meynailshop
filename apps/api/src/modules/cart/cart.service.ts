import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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

@Injectable()
export class CartService {
  private readonly CART_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  private readonly CART_PREFIX = 'cart:';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) { }

  private getCartKey(userId: string): string {
    return `${this.CART_PREFIX}${userId}`;
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartItem> {
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    const cartKey = this.getCartKey(userId);
    const cart = (await this.cacheManager.get<CartData>(cartKey)) || {
      items: [],
    };

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === addToCartDto.productId,
    );

    let cartItem: CartItem;

    if (existingItemIndex >= 0) {
      const newQuantity =
        cart.items[existingItemIndex].quantity + addToCartDto.quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException('Insufficient stock for this quantity');
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].subtotal =
        newQuantity * cart.items[existingItemIndex].productPrice;
      cartItem = cart.items[existingItemIndex];
    } else {
      cartItem = {
        productId: product.id,
        quantity: addToCartDto.quantity,
        productName: product.name,
        productPrice: Number(product.price),
        productImage: product.images?.[0] || '',
        productSku: product.sku,
        subtotal: Number(product.price) * addToCartDto.quantity,
      };

      cart.items.push(cartItem);
    }

    await this.cacheManager.set(cartKey, cart, this.CART_TTL);

    return cartItem;
  }

  async updateItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < updateCartItemDto.quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    const cartKey = this.getCartKey(userId);
    const cart = (await this.cacheManager.get<CartData>(cartKey)) || {
      items: [],
    };

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex < 0) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity = updateCartItemDto.quantity;
    cart.items[itemIndex].subtotal =
      updateCartItemDto.quantity * cart.items[itemIndex].productPrice;

    await this.cacheManager.set(cartKey, cart, this.CART_TTL);

    return cart.items[itemIndex];
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    const cart = (await this.cacheManager.get<CartData>(cartKey)) || {
      items: [],
    };

    cart.items = cart.items.filter((item) => item.productId !== productId);

    if (cart.items.length === 0) {
      await this.cacheManager.del(cartKey);
    } else {
      await this.cacheManager.set(cartKey, cart, this.CART_TTL);
    }
  }

  async getCart(userId: string): Promise<CartData | null> {
    const cartKey = this.getCartKey(userId);
    const result = await this.cacheManager.get<CartData>(cartKey);
    return result ?? null;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.getCart(userId);
    return cart?.items || [];
  }

  async clearCart(userId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.cacheManager.del(cartKey);
  }

  async applyCoupon(userId: string, couponCode: string): Promise<CartData> {
    const cartKey = this.getCartKey(userId);
    const cart = (await this.cacheManager.get<CartData>(cartKey)) || {
      items: [],
    };

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const coupon = await this.couponRepository.findOne({
      where: {
        code: couponCode,
        isActive: true,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (new Date() > coupon.expiresAt) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const subtotal = this.calculateSubtotal(cart.items);

    if (subtotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
      );
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * Number(coupon.value)) / 100;
    } else {
      discount = Number(coupon.value);
    }

    cart.couponCode = couponCode;
    cart.couponDiscount = discount;

    await this.cacheManager.set(cartKey, cart, this.CART_TTL);

    return cart;
  }

  async removeCoupon(userId: string): Promise<CartData> {
    const cartKey = this.getCartKey(userId);
    const cart = (await this.cacheManager.get<CartData>(cartKey)) || {
      items: [],
    };

    delete cart.couponCode;
    delete cart.couponDiscount;

    await this.cacheManager.set(cartKey, cart, this.CART_TTL);

    return cart;
  }

  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  calculateTax(subtotal: number, taxRate: number = 0): number {
    return (subtotal * taxRate) / 100;
  }

  async getCartSummary(userId: string) {
    const cart = await this.getCart(userId);

    if (!cart || cart.items.length === 0) {
      return {
        items: [],
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        shippingCost: 0,
        couponDiscount: 0,
        total: 0,
      };
    }

    const subtotal = this.calculateSubtotal(cart.items);
    const tax = this.calculateTax(subtotal, 0); // Tax rate can be configurable
    const shippingCost = cart.shippingCost || 300; // Default shipping cost
    const couponDiscount = cart.couponDiscount || 0;
    const total = subtotal + tax + shippingCost - couponDiscount;

    return {
      items: cart.items,
      itemCount: cart.items.length,
      subtotal,
      tax,
      shippingCost,
      couponDiscount,
      couponCode: cart.couponCode,
      total: Math.max(0, total),
    };
  }

  async exists(userId: string): Promise<boolean> {
    const cart = await this.getCart(userId);
    return cart !== null && cart.items.length > 0;
  }

  async getCartSize(userId: string): Promise<number> {
    const items = await this.getCartItems(userId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
