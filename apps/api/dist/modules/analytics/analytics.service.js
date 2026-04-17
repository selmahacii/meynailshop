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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../database/entities/order.entity");
const product_entity_1 = require("../../database/entities/product.entity");
let AnalyticsService = class AnalyticsService {
    constructor(orderRepository, productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    async getDashboard() {
        const totalOrders = await this.orderRepository.count();
        const deliveredRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'sum')
            .where('order.status = :status', { status: 'delivered' })
            .getRawOne();
        const returnCosts = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.returnCost)', 'sum')
            .where('order.status = :status', { status: 'returned' })
            .getRawOne();
        const totalRevenue = (Number(deliveredRevenue?.sum) || 0) - (Number(returnCosts?.sum) || 0);
        const activeProducts = await this.productRepository.count({
            where: { isActive: true },
        });
        return {
            totalOrders,
            totalRevenue: totalRevenue,
            activeProducts,
            timestamp: new Date(),
        };
    }
    async getSalesByPeriod(days) {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return this.orderRepository.find({
            where: {
                createdAt: (0, typeorm_2.Between)(startDate, new Date()),
                status: 'delivered',
            },
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map