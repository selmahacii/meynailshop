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
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../database/entities");
const stock_service_1 = require("../../../modules/stock/stock.service");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("@nestjs/typeorm");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, productRepository, reviewRepository, stockService, dataSource) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.stockService = stockService;
        this.dataSource = dataSource;
    }
    async findAll(page = 1, limit = 10, status) {
        const query = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .orderBy('order.createdAt', 'DESC');
        if (status && status !== 'all') {
            if (status === 'active') {
                query.where('order.status NOT IN (:...excluded)', { excluded: ['delivered', 'returned', 'cancelled'] });
            }
            else if (status === 'history') {
                query.where('order.status IN (:...included)', { included: ['delivered', 'returned', 'cancelled'] });
            }
            else {
                query.where('order.status = :status', { status });
            }
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Commande non trouvée');
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        if ((status === 'cancelled' || status === 'returned') &&
            (order.status !== 'cancelled' && order.status !== 'returned')) {
            for (const item of order.items) {
                if (item.productId && item.quantity) {
                    try {
                        await this.stockService.adjustStock(item.productId, item.quantity, `Restitution de stock: Commande ${status === 'returned' ? 'retournée' : 'annulée'}`, order.orderNumber);
                    }
                    catch (error) {
                        console.error(`Failed to restore stock for product ${item.productId} in order ${order.orderNumber}`, error);
                    }
                }
            }
        }
        await this.orderRepository.update(id, { status });
        return await this.findOne(id);
    }
    async getStats() {
        try {
            const [orders, pendingReviews] = await Promise.all([
                this.orderRepository.find(),
                this.reviewRepository.count({ where: { status: 'pending' } }),
            ]);
            const stats = {
                total: orders.length,
                active: orders.filter((o) => !['delivered', 'returned', 'cancelled'].includes(o.status)).length,
                history: orders.filter((o) => ['delivered', 'returned', 'cancelled'].includes(o.status)).length,
                pending: orders.filter((o) => o.status === 'pending').length,
                shipped: orders.filter((o) => o.status === 'shipped').length,
                delivered: orders.filter((o) => o.status === 'delivered').length,
                cancelled: orders.filter((o) => o.status === 'cancelled').length,
                returned: orders.filter((o) => o.status === 'returned').length,
                totalRevenue: orders.reduce((sum, o) => {
                    if (o.status === 'delivered')
                        return sum + (Number(o.total) || 0);
                    if (o.status === 'returned')
                        return sum - (Number(o.returnCost) || 0);
                    return sum;
                }, 0),
                pendingReviews,
            };
            return stats;
        }
        catch (error) {
            console.error('❌ [OrdersV1] getStats Error:', error);
            return {
                total: 0,
                active: 0,
                history: 0,
                pending: 0,
                delivered: 0,
                cancelled: 0,
                returned: 0,
                totalRevenue: 0,
                pendingReviews: 0,
            };
        }
    }
    async createManual(data) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const orderNumber = `MAN-${Date.now()}`;
            const order = queryRunner.manager.create(entities_1.Order, {
                orderNumber,
                source: data.source || 'other',
                deliveryType: data.deliveryType || 'home',
                paymentMethod: data.paymentMethod || 'cash_on_delivery',
                paymentStatus: data.paymentStatus || 'pending',
                status: 'confirmed',
                subtotal: data.subtotal,
                shippingCost: data.shippingCost || 0,
                returnCost: data.returnCost || 0,
                total: data.subtotal + (data.shippingCost || 0),
                shippingAddressSnapshot: data.customer,
                notes: data.notes,
            });
            const savedOrder = await queryRunner.manager.save(entities_1.Order, order);
            for (const item of data.items) {
                const product = await queryRunner.manager.findOne(entities_1.Product, { where: { id: item.productId } });
                if (!product)
                    throw new Error(`Product ${item.productId} not found`);
                const orderItem = queryRunner.manager.create(entities_1.OrderItem, {
                    orderId: savedOrder.id,
                    productId: item.productId,
                    productName: product.name,
                    productSku: item.productSku || product.sku,
                    productImage: product.images?.[0] || '',
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.unitPrice * item.quantity,
                });
                await queryRunner.manager.save(entities_1.OrderItem, orderItem);
                await this.stockService.adjustStock(item.productId, -item.quantity, `Commande manuelle (${data.source})`, orderNumber);
            }
            await queryRunner.commitTransaction();
            return await this.findOne(savedOrder.id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Review)),
    __param(5, (0, typeorm_4.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stock_service_1.StockService,
        typeorm_3.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map