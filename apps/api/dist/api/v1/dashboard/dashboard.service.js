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
    async getMetrics(range = 'all') {
        console.log(`🚀 [DashboardService] Starting getMetrics for range: ${range}`);
        try {
            const now = new Date();
            let startDate = null;
            let prevStartDate = null;
            let prevEndDate = null;
            if (range === '7d') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                prevStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                prevEndDate = startDate;
            }
            else if (range === '30d') {
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                prevStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                prevEndDate = startDate;
            }
            const revenueQueryBuilder = this.orderRepository
                .createQueryBuilder('o')
                .select(`SUM(CASE 
          WHEN o.status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN o.subtotal 
          ELSE 0 
        END)`, 'totalRevenue')
                .addSelect('COUNT(o.id)', 'totalOrders')
                .addSelect("COUNT(CASE WHEN o.status = 'delivered' THEN 1 END)", 'completedOrders')
                .addSelect(`AVG(CASE 
          WHEN o.status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN o.subtotal 
        END)`, 'averageCart');
            if (startDate) {
                revenueQueryBuilder.where('o.createdAt >= :start', { start: startDate });
            }
            const revenueQuery = await revenueQueryBuilder.getRawOne().catch(err => {
                console.error('❌ [DashboardService] Revenue query failed:', err);
                return null;
            });
            const cogsQueryBuilder = this.orderItemRepository
                .createQueryBuilder('oi')
                .leftJoin('products', 'p', 'p.id = oi.productId')
                .leftJoin('orders', 'o', 'o.id = oi.orderId')
                .select('SUM(CASE WHEN o.status IN (\'confirmed\', \'processing\', \'shipped\', \'delivered\') THEN oi.quantity * COALESCE(p."costPrice", 0) ELSE 0 END)', 'totalCogs');
            if (startDate) {
                cogsQueryBuilder.where('o.createdAt >= :start', { start: startDate });
            }
            const cogsQuery = await cogsQueryBuilder.getRawOne().catch(() => ({ totalCogs: 0 }));
            const allActiveProducts = await this.productRepository.find({ where: { isActive: true } });
            const inventoryData = allActiveProducts.reduce((sum, p) => {
                const cost = Number(p.costPrice) || 0;
                if (!p.hasVariants) {
                    return sum + (p.stock * cost);
                }
                else if (p.variants && Array.isArray(p.variants)) {
                    const variantStock = p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
                    return sum + (variantStock * cost);
                }
                return sum;
            }, 0);
            let prevRevenue = 0;
            let prevOrders = 0;
            if (prevStartDate && prevEndDate) {
                const prevQuery = await this.orderRepository
                    .createQueryBuilder('o')
                    .select('SUM(o.subtotal)', 'revenue')
                    .addSelect('COUNT(o.id)', 'orders')
                    .where('o.createdAt >= :start AND o.createdAt < :end', { start: prevStartDate, end: prevEndDate })
                    .getRawOne();
                prevRevenue = parseFloat(prevQuery?.revenue ?? '0') || 0;
                prevOrders = parseInt(prevQuery?.orders ?? '0') || 0;
            }
            const totalRevenue = parseFloat(revenueQuery?.totalRevenue ?? '0') || 0;
            const totalOrders = parseInt(revenueQuery?.totalOrders ?? '0') || 0;
            const averageCart = parseFloat(revenueQuery?.averageCart ?? '0') || 0;
            const activeClients = await this.userRepository.createQueryBuilder('u').where('u.role = :role', { role: 'client' }).getCount();
            const trendGranularity = (range === '7d' || range === '30d') ? 'daily' : 'monthly';
            const monthlyRevenue = await this._getTrend(range, trendGranularity);
            const productSales = await this._getProductSales(startDate);
            const orderStatusBreakdown = await this._getOrderStatusBreakdownOptimized(startDate);
            const lowStockProducts = await this._getLowStockProducts();
            const wilayaDistribution = await this._getWilayaDistribution(startDate);
            const profit = totalRevenue * 0.45;
            const margin = 45;
            return {
                kpis: {
                    totalRevenue,
                    totalProfit: Math.round(profit * 100) / 100,
                    profitMargin: margin,
                    inventoryValue: Math.round(inventoryData * 100) / 100,
                    prevRevenue,
                    totalOrders,
                    prevOrders,
                    activeClients,
                    averageCart: Math.round(averageCart * 100) / 100,
                    healthStatus: 'good'
                },
                charts: {
                    monthlyRevenue,
                    productSales,
                    orderStatusBreakdown,
                    wilayaDistribution,
                },
                alerts: {
                    lowStockProducts,
                },
            };
        }
        catch (error) {
            console.error('❌ [DashboardService] getMetrics Error:', error);
            return { error: error.message };
        }
    }
    async _getTrend(range, granularity) {
        try {
            const data = [];
            const now = new Date();
            const count = range === '7d' ? 7 : range === '30d' ? 30 : 6;
            for (let i = count - 1; i >= 0; i--) {
                const date = granularity === 'daily'
                    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
                    : new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = granularity === 'daily'
                    ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                    : date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                data.push({ name: label, revenue: 0, dateStart: date });
            }
            const orders = await this.orderRepository
                .createQueryBuilder('o')
                .select(['o.subtotal', 'o.createdAt'])
                .where("o.status IN ('confirmed', 'processing', 'shipped', 'delivered')")
                .andWhere('o.createdAt >= :start', { start: data[0].dateStart })
                .getMany();
            orders.forEach(order => {
                const d = new Date(order.createdAt);
                const label = granularity === 'daily'
                    ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                    : d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                const point = data.find(p => p.name === label);
                if (point)
                    point.revenue += Number(order.subtotal) || 0;
            });
            return data.map(p => ({ name: p.name, revenue: Math.round(p.revenue) }));
        }
        catch (error) {
            return [];
        }
    }
    async _getOrderStatusBreakdownOptimized(startDate) {
        try {
            const query = this.orderRepository
                .createQueryBuilder('order')
                .select('order.status', 'status')
                .addSelect('COUNT(order.id)', 'count');
            if (startDate)
                query.where('order.createdAt >= :start', { start: startDate });
            const stats = await query.groupBy('order.status').getRawMany();
            const mapping = {
                pending: 'En attente',
                processing: 'En cours',
                shipped: 'Expédiée',
                delivered: 'Livrée',
                cancelled: 'Annulée',
                returned: 'Retournée',
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
    async _getProductSales(startDate) {
        try {
            const query = this.orderItemRepository
                .createQueryBuilder('item')
                .leftJoin('orders', 'o', 'o.id = item.orderId')
                .select('item.productName', 'name')
                .addSelect('SUM(item.quantity)', 'value');
            if (startDate)
                query.where('o.createdAt >= :start', { start: startDate });
            const rows = await query
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
            const allProducts = await this.productRepository
                .createQueryBuilder('p')
                .where('p.isActive = :isActive', { isActive: true })
                .andWhere('(p.stock <= p."stockAlert" OR p."hasVariants" = true)')
                .getMany();
            const results = [];
            const DEFAULT_ALERT = 5;
            for (const p of allProducts) {
                if (!p.hasVariants) {
                    if (p.stock <= (p.stockAlert || DEFAULT_ALERT)) {
                        results.push({ id: p.id, name: p.name, stock: p.stock, sku: p.sku, isVariant: false });
                    }
                }
                else if (p.variants && Array.isArray(p.variants)) {
                    for (const v of p.variants) {
                        const threshold = v.stockAlert || p.stockAlert || DEFAULT_ALERT;
                        if (v.stock <= threshold) {
                            results.push({
                                id: `${p.id}-${v.sku}`,
                                name: `${p.name} (${v.sku})`,
                                stock: v.stock,
                                sku: v.sku,
                                isVariant: true,
                                productId: p.id
                            });
                        }
                    }
                }
            }
            return results.sort((a, b) => a.stock - b.stock).slice(0, 10);
        }
        catch (error) {
            console.warn('⚠️ [DashboardService] Low stock products failed:', error.message);
            return [];
        }
    }
    async _getWilayaDistribution(startDate) {
        try {
            const query = `
        SELECT 
          COALESCE("shippingAddressSnapshot"->>'wilayaCode', "shippingAddressSnapshot"->>'wilaya') as "wilayaCode",
          COALESCE("shippingAddressSnapshot"->>'wilayaName', "shippingAddressSnapshot"->>'wilaya') as "wilayaName",
          COUNT(*) as "count"
        FROM "orders"
        WHERE "createdAt" >= $1 OR $1 IS NULL
        GROUP BY 1, 2
        ORDER BY "count" DESC
        LIMIT 5
      `;
            const rawData = await this.orderRepository.query(query, [startDate?.toISOString() || null]);
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
                cash_on_delivery: 'Main à main',
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