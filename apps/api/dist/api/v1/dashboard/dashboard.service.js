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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../database/entities/user.entity");
const order_entity_1 = require("../../../database/entities/order.entity");
const product_entity_1 = require("../../../database/entities/product.entity");
let DashboardService = class DashboardService {
    constructor(userRepository, orderRepository, productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    async getMetrics() {
        const orders = await this.orderRepository.find({
            select: ['id', 'total', 'status', 'createdAt'],
        });
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const completedOrders = orders.filter((o) => o.status === 'delivered').length;
        const activeClients = await this.userRepository.count({
            where: { role: 'client', isActive: true },
        });
        const averageCart = orders.length > 0 ? totalRevenue / orders.length : 0;
        const monthlyRevenue = this._getMonthlyTrend(orders);
        const productSales = await this._getProductSales();
        const orderStatusBreakdown = this._getOrderStatusBreakdown(orders);
        const customerGrowth = this._getCustomerGrowth(orders);
        const lowStockProducts = await this._getLowStockProducts();
        return {
            kpis: {
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                totalOrders: orders.length,
                activeClients,
                averageCart: Math.round(averageCart * 100) / 100,
                completedOrders,
            },
            charts: {
                monthlyRevenue,
                productSales,
                orderStatusBreakdown,
                customerGrowth,
            },
            alerts: {
                lowStockProducts,
            },
        };
    }
    _getMonthlyTrend(orders) {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push({
                name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
                revenue: 0,
            });
        }
        orders.forEach((order) => {
            if (order.status === 'delivered') {
                const orderDate = new Date(order.createdAt);
                const monthIndex = months.findIndex((m) => m.name ===
                    orderDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }));
                if (monthIndex >= 0) {
                    months[monthIndex].revenue += Number(order.total) || 0;
                }
            }
        });
        return months;
    }
    async _getProductSales() {
        const products = await this.productRepository.find({ take: 5 });
        return products.map((p) => ({
            name: p.name,
            value: Math.floor(Math.random() * 100) + 20,
        }));
    }
    _getOrderStatusBreakdown(orders) {
        const statuses = {
            pending: 0,
            delivered: 0,
            cancelled: 0,
        };
        orders.forEach((order) => {
            const status = order.status;
            if (status === 'pending' || status === 'delivered' || status === 'cancelled') {
                statuses[status]++;
            }
        });
        return [
            { name: 'En attente', value: statuses.pending },
            { name: 'Livrées', value: statuses.delivered },
            { name: 'Annulées', value: statuses.cancelled },
        ];
    }
    _getCustomerGrowth(orders) {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push({
                month: date.toLocaleDateString('fr-FR', { month: 'short' }),
                customers: Math.floor(Math.random() * 50) + 20,
            });
        }
        return months;
    }
    async _getLowStockProducts() {
        const products = await this.productRepository.find({
            where: { stock: 10 },
            take: 5,
        });
        return products.map((p) => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
            sku: p.sku,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map