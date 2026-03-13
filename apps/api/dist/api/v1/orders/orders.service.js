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
let OrdersService = class OrdersService {
    constructor(orderRepository, reviewRepository, stockService) {
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
        this.stockService = stockService;
    }
    async findAll(page = 1, limit = 10, status) {
        const query = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .orderBy('order.createdAt', 'DESC');
        if (status && status !== 'all') {
            query.where('order.status = :status', { status });
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
                pending: orders.filter((o) => o.status === 'pending').length,
                shipped: orders.filter((o) => o.status === 'shipped').length,
                delivered: orders.filter((o) => o.status === 'delivered').length,
                cancelled: orders.filter((o) => o.status === 'cancelled').length,
                returned: orders.filter((o) => o.status === 'returned').length,
                totalRevenue: orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
                pendingReviews,
            };
            return stats;
        }
        catch (error) {
            console.error('❌ [OrdersV1] getStats Error:', error);
            return {
                total: 0,
                pending: 0,
                delivered: 0,
                cancelled: 0,
                returned: 0,
                totalRevenue: 0,
                pendingReviews: 0,
            };
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stock_service_1.StockService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map