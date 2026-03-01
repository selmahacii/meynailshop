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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKPIs() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const [currentOrders, currentRevenue, lowStockCount, totalCustomers] = await Promise.all([
            this.prisma.order.count({
                where: { createdAt: { gte: sevenDaysAgo } },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: sevenDaysAgo } },
            }),
            this.prisma.product.count({
                where: {
                    OR: [
                        { stock: 0 },
                        { stock: { lte: 5 } },
                    ],
                },
            }),
            this.prisma.order.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { customerEmail: true },
                distinct: ['customerEmail'],
            }),
        ]);
        const [prevOrders, prevRevenue] = await Promise.all([
            this.prisma.order.count({
                where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
            }),
        ]);
        const revenue = Number(currentRevenue._sum.total || 0);
        const prevRevenueVal = Number(prevRevenue._sum.total || 0);
        const revenueChange = prevRevenueVal > 0
            ? Math.round(((revenue - prevRevenueVal) / prevRevenueVal) * 100 * 10) / 10
            : 0;
        const ordersChange = prevOrders > 0
            ? Math.round(((currentOrders - prevOrders) / prevOrders) * 100 * 10) / 10
            : 0;
        return {
            revenue,
            revenueChange,
            totalOrders: currentOrders,
            ordersChange,
            lowStockCount,
            totalCustomers: totalCustomers.length,
            customersChange: 0,
        };
    }
    async getSalesChart(period = '7d') {
        const days = period === '30d' ? 30 : 7;
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const start = new Date();
            start.setDate(start.getDate() - i);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setHours(23, 59, 59, 999);
            const [revenue, orderCount] = await Promise.all([
                this.prisma.order.aggregate({
                    _sum: { total: true },
                    where: { createdAt: { gte: start, lte: end } },
                }),
                this.prisma.order.count({
                    where: { createdAt: { gte: start, lte: end } },
                }),
            ]);
            result.push({
                date: start.toLocaleDateString('fr-FR', { weekday: 'short' }),
                sales: Number(revenue._sum.total || 0),
                orders: orderCount,
            });
        }
        return result;
    }
    async getOrders(page = '1', limit = '20', status) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where = {};
        if (status) {
            where.status = status.toUpperCase();
        }
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                include: { items: true },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }
    async getInventory(page = '1') {
        const pageNum = parseInt(page);
        const limit = 20;
        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                orderBy: { stock: 'asc' },
                skip: (pageNum - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    stock: true,
                    lowStockThreshold: true,
                    category: { select: { name: true } },
                },
            }),
            this.prisma.product.count(),
        ]);
        return {
            data: data.map((item) => ({
                id: item.id,
                name: item.name,
                sku: item.sku || 'N/A',
                stock: item.stock,
                threshold: item.lowStockThreshold,
                category: item.category.name,
            })),
            meta: {
                total,
                page: pageNum,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getCategoriesDistribution() {
        const categories = await this.prisma.category.findMany({
            include: {
                _count: { select: { products: true } },
            },
        });
        const total = categories.reduce((sum, c) => sum + c._count.products, 0);
        const colors = ['#6B0000', '#C8A96E', '#8B1A1A', '#D4BA85', '#4A0000'];
        return categories.map((cat, i) => ({
            name: cat.name,
            value: total > 0 ? Math.round((cat._count.products / total) * 100) : 0,
            color: colors[i % colors.length],
        }));
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('kpis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getKPIs", null);
__decorate([
    (0, common_1.Get)('sales-chart'),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSalesChart", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('inventory'),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)('categories-distribution'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCategoriesDistribution", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/v1/admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map