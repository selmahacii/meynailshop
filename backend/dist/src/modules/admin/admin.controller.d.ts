import { PrismaService } from '../../database/prisma.service';
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    getKPIs(): Promise<{
        revenue: number;
        revenueChange: number;
        totalOrders: number;
        ordersChange: number;
        lowStockCount: number;
        totalCustomers: number;
        customersChange: number;
    }>;
    getSalesChart(period?: string): Promise<any[]>;
    getOrders(page?: string, limit?: string, status?: string): Promise<{
        data: ({
            items: {
                total: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productName: string;
                productImage: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
                productId: string;
            }[];
        } & {
            total: import("@prisma/client/runtime/library").Decimal;
            id: string;
            orderNumber: string;
            customerName: string;
            customerEmail: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            shipping: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getInventory(page?: string): Promise<{
        data: {
            id: string;
            name: string;
            sku: string;
            stock: number;
            threshold: number;
            category: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCategoriesDistribution(): Promise<{
        name: string;
        value: number;
        color: string;
    }[]>;
}
