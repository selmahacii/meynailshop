"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const product_entity_1 = require("../../database/entities/product.entity");
const coupon_entity_1 = require("../../database/entities/coupon.entity");
let CartService = class CartService {
    constructor(cacheManager, productRepository, couponRepository) {
        this.cacheManager = cacheManager;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.CART_TTL = 30 * 24 * 60 * 60 * 1000;
        this.CART_PREFIX = 'cart:';
    }
    getCartKey(userId) {
        return `${this.CART_PREFIX}${userId}`;
    }
    async addItem(userId, addToCartDto) {
        const product = await this.productRepository.findOne({
            where: { id: addToCartDto.productId, isActive: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < addToCartDto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock available');
        }
        const cartKey = this.getCartKey(userId);
        const cart = (await this.cacheManager.get(cartKey)) || {
            items: [],
        };
        const existingItemIndex = cart.items.findIndex((item) => item.productId === addToCartDto.productId);
        let cartItem;
        if (existingItemIndex >= 0) {
            const newQuantity = cart.items[existingItemIndex].quantity + addToCartDto.quantity;
            if (newQuantity > product.stock) {
                throw new common_1.BadRequestException('Insufficient stock for this quantity');
            }
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].subtotal =
                newQuantity * cart.items[existingItemIndex].productPrice;
            cartItem = cart.items[existingItemIndex];
        }
        else {
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
    async updateItem(userId, productId, updateCartItemDto) {
        const product = await this.productRepository.findOne({
            where: { id: productId, isActive: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < updateCartItemDto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock available');
        }
        const cartKey = this.getCartKey(userId);
        const cart = (await this.cacheManager.get(cartKey)) || {
            items: [],
        };
        const itemIndex = cart.items.findIndex((item) => item.productId === productId);
        if (itemIndex < 0) {
            throw new common_1.NotFoundException('Item not found in cart');
        }
        cart.items[itemIndex].quantity = updateCartItemDto.quantity;
        cart.items[itemIndex].subtotal =
            updateCartItemDto.quantity * cart.items[itemIndex].productPrice;
        await this.cacheManager.set(cartKey, cart, this.CART_TTL);
        return cart.items[itemIndex];
    }
    async removeItem(userId, productId) {
        const cartKey = this.getCartKey(userId);
        const cart = (await this.cacheManager.get(cartKey)) || {
            items: [],
        };
        cart.items = cart.items.filter((item) => item.productId !== productId);
        if (cart.items.length === 0) {
            await this.cacheManager.del(cartKey);
        }
        else {
            await this.cacheManager.set(cartKey, cart, this.CART_TTL);
        }
    }
    async getCart(userId) {
        const cartKey = this.getCartKey(userId);
        const result = await this.cacheManager.get(cartKey);
        return result ?? null;
    }
    async getCartItems(userId) {
        const cart = await this.getCart(userId);
        return cart?.items || [];
    }
    async clearCart(userId) {
        const cartKey = this.getCartKey(userId);
        await this.cacheManager.del(cartKey);
    }
    async applyCoupon(userId, couponCode) {
        const cartKey = this.getCartKey(userId);
        const cart = (await this.cacheManager.get(cartKey)) || {
            items: [],
        };
        if (cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const coupon = await this.couponRepository.findOne({
            where: {
                code: couponCode,
                isActive: true,
            },
        });
        if (!coupon) {
            throw new common_1.BadRequestException('Invalid coupon code');
        }
        if (new Date() > coupon.expiresAt) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (coupon.usedCount >= coupon.maxUses) {
            throw new common_1.BadRequestException('Coupon usage limit reached');
        }
        const subtotal = this.calculateSubtotal(cart.items);
        if (subtotal < Number(coupon.minOrderAmount)) {
            throw new common_1.BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
        }
        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = (subtotal * Number(coupon.value)) / 100;
        }
        else {
            discount = Number(coupon.value);
        }
        cart.couponCode = couponCode;
        cart.couponDiscount = discount;
        await this.cacheManager.set(cartKey, cart, this.CART_TTL);
        return cart;
    }
    async removeCoupon(userId) {
        const cartKey = this.getCartKey(userId);
        const cart = (await this.cacheManager.get(cartKey)) || {
            items: [],
        };
        delete cart.couponCode;
        delete cart.couponDiscount;
        await this.cacheManager.set(cartKey, cart, this.CART_TTL);
        return cart;
    }
    calculateSubtotal(items) {
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    }
    calculateTax(subtotal, taxRate = 0) {
        return (subtotal * taxRate) / 100;
    }
    async getCartSummary(userId) {
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
        const tax = this.calculateTax(subtotal, 0);
        const shippingCost = cart.shippingCost || 300;
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
    async exists(userId) {
        const cart = await this.getCart(userId);
        return cart !== null && cart.items.length > 0;
    }
    async getCartSize(userId) {
        const items = await this.getCartItems(userId);
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map