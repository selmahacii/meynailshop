import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Controller('api/v1/admin')
export class AdminController {
    constructor(private prisma: PrismaService) { }

    @Get('kpis')
    async getKPIs() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        // Current period
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
                        { stock: { lte: 5 } }, // below threshold
                    ],
                },
            }),
            this.prisma.order.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { customerEmail: true },
                distinct: ['customerEmail'],
            }),
        ]);

        // Previous period for comparison
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

    @Get('sales-chart')
    async getSalesChart(@Query('period') period: string = '7d') {
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

    @Get('orders')
    async getOrders(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('status') status?: string,
    ) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where: any = {};

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

    @Get('inventory')
    async getInventory(@Query('page') page: string = '1') {
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

    @Get('categories-distribution')
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
}
