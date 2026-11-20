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
exports.OrdersService = void 0;
exports.calculateOrderShippingRate = calculateOrderShippingRate;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const order_entity_1 = require("../../database/entities/order.entity");
const order_item_entity_1 = require("../../database/entities/order-item.entity");
const address_entity_1 = require("../../database/entities/address.entity");
const product_entity_1 = require("../../database/entities/product.entity");
const coupon_entity_1 = require("../../database/entities/coupon.entity");
const site_settings_entity_1 = require("../../database/entities/site-settings.entity");
const order_number_util_1 = require("../../common/utils/order-number.util");
const settings_service_1 = require("../settings/settings.service");
const notifications_service_1 = require("../notifications/notifications.service");
function calculateOrderShippingRate(snapshot, deliveryType = 'home', fees = settings_service_1.DEFAULT_SHIPPING_FEES) {
    if (!snapshot)
        return null;
    const rawWilaya = (snapshot.wilaya ||
        snapshot.wilayaName ||
        snapshot.address?.wilaya ||
        snapshot.address?.wilayaName ||
        (typeof snapshot.address === 'string' ? '' : '') ||
        '').toString().trim();
    if (!rawWilaya)
        return null;
    const q = rawWilaya.toLowerCase().trim();
    const wilayaRate = fees.find((f) => {
        const fid = (f.id || '').toString().trim();
        const fname = (f.name || '').toLowerCase().trim();
        return (fid === q ||
            fid === q.padStart(2, '0') ||
            fname === q ||
            q.includes(fname) ||
            (fname && q.startsWith(fid)));
    });
    if (!wilayaRate)
        return null;
    const isHome = deliveryType === 'home';
    const shippingCost = isHome
        ? Number(wilayaRate.homeRate)
        : Number(wilayaRate.deskRate ?? wilayaRate.homeRate);
    const returnCost = Number(wilayaRate.returnRate || 0);
    return {
        shippingCost,
        returnCost,
        wilayaRate,
    };
}
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, addressRepository, productRepository, couponRepository, dataSource, notificationsService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.dataSource = dataSource;
        this.notificationsService = notificationsService;
    }
    async onModuleInit() {
        await this.repairOrdersWithDefaultShipping();
    }
    async repairOrdersWithDefaultShipping() {
        try {
            const orders = await this.orderRepository.find();
            for (const order of orders) {
                if (Number(order.shippingCost) === 600 && order.shippingAddressSnapshot) {
                    const calculated = calculateOrderShippingRate(order.shippingAddressSnapshot, order.deliveryType);
                    if (calculated) {
                        order.shippingCost = calculated.shippingCost;
                        order.returnCost = calculated.returnCost;
                        const subtotal = Number(order.subtotal || 0);
                        const discount = Number(order.discount || 0);
                        order.total = subtotal + calculated.shippingCost - discount;
                        await this.orderRepository.save(order);
                        console.log(`[OrdersService] Repaired order ${order.orderNumber}: shippingCost set to ${calculated.shippingCost} DA`);
                    }
                }
            }
        }
        catch (err) {
            console.error('[OrdersService] Error repairing orders with default shipping:', err);
        }
    }
    async create(userId, createOrderDto, cartItems) {
        if (!cartItems || cartItems.length === 0) {
            if (!createOrderDto.notes?.includes('Landing Page')) {
                throw new common_1.BadRequestException('Cart is empty');
            }
        }
        let shippingAddress = null;
        if (createOrderDto.addressId) {
            if (!userId)
                throw new common_1.BadRequestException('UserId required for addressId');
            const address = await this.addressRepository.findOne({
                where: { id: createOrderDto.addressId, userId },
            });
            if (!address) {
                throw new common_1.NotFoundException('Address not found');
            }
            shippingAddress = {
                fullName: address.fullName,
                phone: address.phone,
                wilaya: address.wilaya,
                commune: address.commune,
                address: address.address,
                postalCode: address.postalCode,
            };
        }
        else if (createOrderDto.shippingAddress) {
            shippingAddress = createOrderDto.shippingAddress;
        }
        else {
            throw new common_1.BadRequestException('Shipping address or addressId is required');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let subtotal = 0;
            const items = [];
            if (!cartItems || cartItems.length === 0) {
                let fallbackProduct = await queryRunner.manager.findOne(product_entity_1.Product, { where: { isActive: true } });
                if (!fallbackProduct) {
                    fallbackProduct = await queryRunner.manager.findOne(product_entity_1.Product, {});
                }
                const defaultPackName = createOrderDto.notes?.includes('Landing Page')
                    ? (createOrderDto.notes.split('] ')[1] || 'Pack Onglerie')
                    : 'Commande Boutique';
                cartItems = [{
                        productId: fallbackProduct ? fallbackProduct.id : undefined,
                        productName: defaultPackName,
                        quantity: 1,
                        unitPrice: 6500
                    }];
            }
            for (const cartItem of cartItems) {
                let product = null;
                if (cartItem.productId) {
                    try {
                        product = await queryRunner.manager.findOne(product_entity_1.Product, {
                            where: { id: cartItem.productId, isActive: true },
                        });
                    }
                    catch {
                        product = null;
                    }
                }
                if (!product) {
                    product = await queryRunner.manager.findOne(product_entity_1.Product, {
                        where: { isActive: true },
                    });
                }
                if (!product) {
                    product = await queryRunner.manager.findOne(product_entity_1.Product, {});
                }
                let activePrice = (cartItem.unitPrice !== undefined && cartItem.unitPrice !== null)
                    ? Number(cartItem.unitPrice)
                    : (product ? Number(product.price) : 6500);
                let currentStock = product ? product.stock : 999;
                let variantIndex = -1;
                if (product && product.hasVariants && cartItem.variantSku && product.variants) {
                    variantIndex = product.variants.findIndex(v => v.sku === cartItem.variantSku);
                    if (variantIndex !== -1) {
                        const variant = product.variants[variantIndex];
                        currentStock = variant.stock;
                        if (cartItem.unitPrice === undefined && variant.price !== undefined && variant.price !== null) {
                            activePrice = Number(variant.price);
                        }
                    }
                }
                const itemQuantity = Number(cartItem.quantity) || 1;
                const itemSubtotal = activePrice * itemQuantity;
                subtotal += itemSubtotal;
                const itemName = cartItem.productName || (product ? product.name : 'Pack Onglerie');
                const itemSku = cartItem.variantSku || (product ? product.sku : 'PACK-LP');
                const itemImage = cartItem.productImage || cartItem.variantImage || (product?.images?.[0] || '');
                const orderItem = this.orderItemRepository.create({
                    productId: product ? product.id : null,
                    productName: itemName,
                    productSku: itemSku,
                    productImage: itemImage,
                    variantSku: cartItem.variantSku,
                    variantImage: itemImage,
                    unitPrice: activePrice,
                    quantity: itemQuantity,
                    subtotal: itemSubtotal,
                });
                items.push(orderItem);
                if (product && product.stock > 0 && !cartItem.unitPrice) {
                    if (variantIndex !== -1 && product.variants) {
                        product.variants[variantIndex].stock = Math.max(0, product.variants[variantIndex].stock - itemQuantity);
                        product.stock = Math.max(0, product.stock - itemQuantity);
                    }
                    else {
                        product.stock = Math.max(0, product.stock - itemQuantity);
                    }
                    await queryRunner.manager.save(product_entity_1.Product, product);
                }
            }
            let discount = 0;
            if (createOrderDto.couponCode) {
                const coupon = await queryRunner.manager.findOne(coupon_entity_1.Coupon, {
                    where: {
                        code: createOrderDto.couponCode,
                        isActive: true,
                        expiresAt: (0, typeorm_3.MoreThan)(new Date()),
                    },
                });
                if (!coupon) {
                    throw new common_1.BadRequestException('Invalid or expired coupon code');
                }
                if (coupon.usedCount >= coupon.maxUses) {
                    throw new common_1.BadRequestException('Coupon usage limit reached');
                }
                if (subtotal < Number(coupon.minOrderAmount)) {
                    throw new common_1.BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
                }
                if (coupon.type === 'percentage') {
                    discount = (subtotal * Number(coupon.value)) / 100;
                }
                else {
                    discount = Number(coupon.value);
                }
                coupon.usedCount += 1;
                await queryRunner.manager.save(coupon_entity_1.Coupon, coupon);
            }
            const settings = await queryRunner.manager.findOne(site_settings_entity_1.SiteSettings, { where: {} });
            const fees = (settings?.shippingFees && Array.isArray(settings.shippingFees) && settings.shippingFees.length > 0)
                ? settings.shippingFees
                : settings_service_1.DEFAULT_SHIPPING_FEES;
            let shippingCost = Number(settings?.shippingCostDefault) || 600;
            let returnCost = 0;
            if (shippingAddress) {
                const calculated = calculateOrderShippingRate(shippingAddress, createOrderDto.deliveryType || 'home', fees);
                if (calculated) {
                    shippingCost = calculated.shippingCost;
                    returnCost = calculated.returnCost;
                }
            }
            if (subtotal >= Number(settings?.freeShippingThreshold || 10000)) {
                shippingCost = 0;
            }
            const total = subtotal - discount + shippingCost;
            const orderSource = createOrderDto.source ||
                (createOrderDto.notes?.includes('Landing Page') ? 'instagram' : 'website');
            const order = this.orderRepository.create({
                userId,
                orderNumber: (0, order_number_util_1.generateOrderNumber)(),
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: createOrderDto.paymentMethod,
                deliveryType: createOrderDto.deliveryType,
                source: orderSource,
                subtotal,
                shippingCost,
                returnCost,
                discount,
                total,
                shippingAddressSnapshot: shippingAddress,
                notes: createOrderDto.notes,
            });
            const savedOrder = await queryRunner.manager.save(order_entity_1.Order, order);
            for (const item of items) {
                item.orderId = savedOrder.id;
            }
            await queryRunner.manager.save(order_item_entity_1.OrderItem, items);
            await queryRunner.commitTransaction();
            const result = await this.orderRepository.findOne({
                where: { id: savedOrder.id },
                relations: ['user'],
            });
            if (!result)
                throw new common_1.InternalServerErrorException('Order not found after creation');
            this.notificationsService.sendAdminOrderNotification(result, items).catch((notifErr) => {
                console.error('[OrdersService] Error dispatching order notification:', notifErr);
            });
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(userId, query, isAdmin = false) {
        const skip = (query.page - 1) * query.limit;
        const where = {};
        if (!isAdmin) {
            where.userId = userId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.paymentStatus) {
            where.paymentStatus = query.paymentStatus;
        }
        if (query.paymentMethod) {
            where.paymentMethod = query.paymentMethod;
        }
        if (query.orderNumber) {
            where.orderNumber = query.orderNumber;
        }
        if (query.dateFrom || query.dateTo) {
            const dateRange = {};
            if (query.dateFrom) {
                dateRange.gte = new Date(query.dateFrom);
            }
            if (query.dateTo) {
                const dateTo = new Date(query.dateTo);
                dateTo.setHours(23, 59, 59, 999);
                dateRange.lte = dateTo;
            }
            where.createdAt = (0, typeorm_3.Between)(dateRange.gte || new Date(0), dateRange.lte || new Date());
        }
        const order = {};
        if (query.sortBy) {
            order[query.sortBy] = query.order === 'asc' ? 'ASC' : 'DESC';
        }
        else {
            order.createdAt = 'DESC';
        }
        const [orders, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['user'],
            skip,
            take: query.limit,
            order,
        });
        return {
            items: orders,
            total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(total / query.limit),
            hasNext: skip + query.limit < total,
            hasPrev: query.page > 1,
        };
    }
    async findOne(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (userId && order.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized access to this order');
        }
        return order;
    }
    async findOneWithItems(id, userId) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (userId && order.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized access to this order');
        }
        const items = await this.orderItemRepository.find({
            where: { orderId: id },
        });
        return { ...order, items };
    }
    async updateStatus(id, updateOrderStatusDto) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.status = updateOrderStatusDto.status;
        if (updateOrderStatusDto.trackingNumber) {
            order.trackingNumber = updateOrderStatusDto.trackingNumber;
        }
        if (updateOrderStatusDto.status === 'shipped') {
            order.shippedAt = new Date();
        }
        else if (updateOrderStatusDto.status === 'delivered') {
            order.deliveredAt = new Date();
        }
        else if (updateOrderStatusDto.status === 'cancelled') {
            order.cancelledAt = new Date();
        }
        return await this.orderRepository.save(order);
    }
    async cancel(id, userId, reason) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized access to this order');
        }
        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new common_1.BadRequestException('Only pending or confirmed orders can be cancelled');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const items = await this.orderItemRepository.find({
                where: { orderId: id },
            });
            for (const item of items) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                    where: { id: item.productId },
                });
                if (product) {
                    product.stock += item.quantity;
                    await queryRunner.manager.save(product_entity_1.Product, product);
                }
            }
            order.status = 'cancelled';
            order.cancelledAt = new Date();
            order.cancellationReason = reason;
            await queryRunner.manager.save(order_entity_1.Order, order);
            await queryRunner.commitTransaction();
            return order;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getOrderStats(userId, isAdmin = false) {
        const where = isAdmin ? {} : { userId };
        const totalOrders = await this.orderRepository.count({ where });
        const completedOrders = await this.orderRepository.count({
            where: { ...where, status: 'delivered' },
        });
        const pendingOrders = await this.orderRepository.count({
            where: { ...where, status: 'pending' },
        });
        const cancelledOrders = await this.orderRepository.count({
            where: { ...where, status: 'cancelled' },
        });
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where(isAdmin ? '1=1' : 'order.userId = :userId', { userId })
            .andWhere('order.status = :status', { status: 'delivered' })
            .getRawOne();
        return {
            totalOrders,
            completedOrders,
            pendingOrders,
            cancelledOrders,
            totalRevenue: Number(totalRevenue?.total || 0),
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(4, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __param(5, (0, typeorm_2.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.DataSource,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map