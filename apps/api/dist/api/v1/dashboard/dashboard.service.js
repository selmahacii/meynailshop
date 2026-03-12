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
const entities_1 = require("../../../database/entities");
let DashboardService = class DashboardService {
    constructor(userRepository, orderRepository, productRepository, orderItemRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }
    async getMetrics() {
        console.log('🚀 [DashboardService] Starting getMetrics');
        try {
            const revenueQuery = await this.orderRepository
                .createQueryBuilder('o')
                .select('SUM(o.total)', 'totalRevenue')
                .addSelect('COUNT(o.id)', 'totalOrders')
                .addSelect('COUNT(CASE WHEN o.status = \'delivered\' THEN 1 END)', 'completedOrders')
                .addSelect('AVG(o.total)', 'averageCart')
                .getRawOne()
                .catch(err => {
                console.error('❌ [DashboardService] Revenue query failed:', err);
                return null;
            });
            const lastMonthStart = new Date();
            lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
            lastMonthStart.setDate(1);
            lastMonthStart.setHours(0, 0, 0, 0);
            const thisMonthStart = new Date();
            thisMonthStart.setDate(1);
            thisMonthStart.setHours(0, 0, 0, 0);
            const prevMonthQuery = await this.orderRepository
                .createQueryBuilder('o')
                .select('SUM(o.total)', 'totalRevenue')
                .addSelect('COUNT(o.id)', 'totalOrders')
                .where('o.createdAt >= :start', { start: lastMonthStart })
                .andWhere('o.createdAt < :end', { end: thisMonthStart })
                .getRawOne()
                .catch(err => {
                console.error('❌ [DashboardService] Prev month query failed:', err);
                return null;
            });
            const totalRevenue = parseFloat(revenueQuery?.totalRevenue ?? '0') || 0;
            const totalOrders = parseInt(revenueQuery?.totalOrders ?? '0') || 0;
            const completedOrders = parseInt(revenueQuery?.completedOrders ?? '0') || 0;
            const averageCart = parseFloat(revenueQuery?.averageCart ?? '0') || 0;
            const prevRevenue = parseFloat(prevMonthQuery?.totalRevenue ?? '0') || 0;
            const prevOrders = parseInt(prevMonthQuery?.totalOrders ?? '0') || 0;
            const activeClients = await this.userRepository.count({
                where: { role: 'client', isActive: true },
            }).catch(err => {
                console.error('❌ [DashboardService] User count failed:', err);
                return 0;
            });
            const prevClients = await this.userRepository.count({
                where: {
                    role: 'client',
                    isActive: true,
                    createdAt: (0, typeorm_2.LessThanOrEqual)(lastMonthStart)
                },
            }).catch(err => {
                console.error('❌ [DashboardService] Prev user count failed:', err);
                return 0;
            });
            const monthlyRevenue = [];
            const productSales = [];
            const orderStatusBreakdown = [];
            const customerGrowth = [];
            const lowStockProducts = [];
            const wilayaDistribution = [];
            const paymentMethodDistribution = [];
            return {
                kpis: {
                    totalRevenue: totalRevenue || 0,
                    prevRevenue: prevRevenue || 0,
                    totalOrders: totalOrders || 0,
                    prevOrders: prevOrders || 0,
                    activeClients: activeClients || 0,
                    prevClients: prevClients || 0,
                    averageCart: averageCart || 0,
                    completedOrders: completedOrders || 0,
                },
                charts: {
                    monthlyRevenue: [],
                    productSales: [],
                    orderStatusBreakdown: [],
                    customerGrowth: [],
                    wilayaDistribution: [],
                    paymentMethodDistribution: [],
                },
                alerts: {
                    lowStockProducts: [],
                },
            };
        }
        catch (error) {
            console.error('❌ [DashboardService] getMetrics Error:', error);
            return { error: error.message };
        }
    }
    async _getMonthlyTrendOptimized() {
        try {
            const months = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push({
                    name: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
                    revenue: 0,
                    start: start.toISOString(),
                });
            }
            const dataByMonth = await this.orderRepository
                .createQueryBuilder('order')
                .select('order.total', 'total')
                .addSelect('order.createdAt', 'createdAt')
                .where('order.status = :status', { status: 'delivered' })
                .andWhere('order.createdAt >= :start', { start: months[0].start })
                .getRawMany();
            dataByMonth.forEach(row => {
                const date = new Date(row.createdAt);
                const label = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                const month = months.find(m => m.name === label);
                if (month) {
                    month.revenue += parseFloat(row.total) || 0;
                }
            });
            return months.map(m => ({ name: m.name, revenue: Math.round(m.revenue * 100) / 100 }));
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Monthly trend failed:', error.message);
            return [];
        }
    }
    async _getOrderStatusBreakdownOptimized() {
        try {
            const stats = await this.orderRepository
                .createQueryBuilder('order')
                .select('order.status', 'status')
                .addSelect('COUNT(order.id)', 'count')
                .groupBy('order.status')
                .getRawMany();
            const mapping = {
                pending: 'En attente',
                processing: 'En cours',
                shipped: 'Expédiée',
                delivered: 'Livrée',
                cancelled: 'Annulée',
            };
            return stats.map(s => ({
                name: mapping[s.status] || s.status,
                value: parseInt(s.count) || 0,
            }));
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Order breakdown failed:', error.message);
            return [];
        }
    }
    async _getProductSales() {
        try {
            const rows = await this.orderItemRepository
                .createQueryBuilder('item')
                .select('item.productName', 'name')
                .addSelect('SUM(item.quantity)', 'value')
                .groupBy('item.productName')
                .orderBy('SUM(item.quantity)', 'DESC')
                .limit(5)
                .getRawMany();
            return rows.map((row) => ({
                name: row.name,
                value: parseInt(row.value) || 0,
            }));
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Product sales failed:', error.message);
            return [];
        }
    }
    async _getCustomerGrowth() {
        try {
            const months = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const start = new Date(now.getFullYear(), now.getMonth() - i, 1, 0, 0, 0, 0);
                const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1, 0, 0, 0, 0);
                months.push({ label: start.toLocaleDateString('fr-FR', { month: 'short' }), start, end });
            }
            const clients = await this.userRepository
                .createQueryBuilder('u')
                .select(['u.id', 'u.createdAt'])
                .where('u.role = :role', { role: 'client' })
                .andWhere('u.createdAt >= :start', { start: months[0].start.toISOString() })
                .getMany();
            return months.map((m) => ({
                month: m.label,
                customers: clients.filter((c) => {
                    const createdAt = new Date(c.createdAt);
                    return createdAt >= m.start && createdAt < m.end;
                }).length,
            }));
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Customer growth failed:', error.message);
            return [];
        }
    }
    async _getLowStockProducts() {
        try {
            const products = await this.productRepository
                .createQueryBuilder('p')
                .where('p.stock <= :limit', { limit: 10 })
                .andWhere('p.isActive = :isActive', { isActive: true })
                .orderBy('p.stock', 'ASC')
                .limit(5)
                .getMany();
            return products.map((p) => ({ id: p.id, name: p.name, stock: p.stock, sku: p.sku }));
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Low stock products failed:', error.message);
            return [];
        }
    }
    async _getWilayaDistribution() {
        try {
            const rawData = await this.orderRepository.query(`
        SELECT 
          "shippingAddressSnapshot"->>'wilaya' as "wilayaCode",
          "shippingAddressSnapshot"->>'wilayaName' as "wilayaName",
          COUNT(*) as "count"
        FROM "orders"
        WHERE "shippingAddressSnapshot"->>'wilaya' IS NOT NULL
        GROUP BY "shippingAddressSnapshot"->>'wilaya', "shippingAddressSnapshot"->>'wilayaName'
        ORDER BY "count" DESC
        LIMIT 5
      `);
            if (!rawData || !Array.isArray(rawData))
                return [];
            const total = rawData.reduce((sum, s) => sum + (parseInt(s.count) || 0), 0);
            return rawData.map((s) => {
                const count = parseInt(s.count) || 0;
                return {
                    wilaya: s.wilayaName || s.wilayaCode || 'Inconnue',
                    count,
                    percent: total > 0 ? Math.round((count / total) * 100) : 0,
                };
            });
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Wilaya distribution failed:', error.message);
            return [];
        }
    }
    async _getPaymentMethodDistribution() {
        try {
            const stats = await this.orderRepository
                .createQueryBuilder('order')
                .select('order.paymentMethod', 'method')
                .addSelect('COUNT(order.id)', 'count')
                .groupBy('order.paymentMethod')
                .getRawMany();
            const mapping = {
                cash_on_delivery: 'À la livraison',
                baridimob: 'Baridimob',
                ccp: 'CCP',
            };
            const total = stats.reduce((sum, s) => sum + (parseInt(s.count) || 0), 0);
            return stats.map(s => {
                const count = parseInt(s.count) || 0;
                return {
                    name: mapping[s.method] || s.method || 'Inconnu',
                    value: count,
                    percent: total > 0 ? Math.round((count / total) * 100) : 0,
                };
            });
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Payment distribution failed:', error.message);
            return [];
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map