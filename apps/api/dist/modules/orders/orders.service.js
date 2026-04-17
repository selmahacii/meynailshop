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
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, addressRepository, productRepository, couponRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.dataSource = dataSource;
    }
    async create(userId, createOrderDto, cartItems) {
        if (!cartItems || cartItems.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
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
            for (const cartItem of cartItems) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                    where: { id: cartItem.productId, isActive: true },
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${cartItem.productId} not found`);
                }
                if (product.stock < cartItem.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
                }
                const itemSubtotal = Number(product.price) * cartItem.quantity;
                subtotal += itemSubtotal;
                const orderItem = this.orderItemRepository.create({
                    productId: product.id,
                    productName: product.name,
                    productSku: cartItem.variantSku || product.sku,
                    productImage: cartItem.variantImage || product.images?.[0] || '',
                    variantSku: cartItem.variantSku,
                    variantImage: cartItem.variantImage,
                    unitPrice: Number(product.price),
                    quantity: cartItem.quantity,
                    subtotal: itemSubtotal,
                });
                items.push(orderItem);
                product.stock -= cartItem.quantity;
                await queryRunner.manager.save(product_entity_1.Product, product);
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
            let shippingCost = settings?.shippingCostDefault || 600;
            let returnCost = 0;
            if (shippingAddress && settings?.shippingFees) {
                const wilayaRate = settings.shippingFees.find((f) => f.id === shippingAddress.wilaya || f.name === shippingAddress.wilaya);
                if (wilayaRate) {
                    shippingCost = createOrderDto.deliveryType === 'home' ? wilayaRate.homeRate : (wilayaRate.deskRate ?? wilayaRate.homeRate);
                    returnCost = wilayaRate.returnRate || 0;
                }
            }
            if (subtotal >= Number(settings?.freeShippingThreshold || 10000)) {
                shippingCost = 0;
            }
            const total = subtotal - discount + shippingCost;
            const order = this.orderRepository.create({
                userId,
                orderNumber: (0, order_number_util_1.generateOrderNumber)(),
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: createOrderDto.paymentMethod,
                deliveryType: createOrderDto.deliveryType,
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
        const validTransitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: [],
            refunded: [],
        };
        if (!validTransitions[order.status].includes(updateOrderStatusDto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${order.status} to ${updateOrderStatusDto.status}`);
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
        typeorm_3.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map