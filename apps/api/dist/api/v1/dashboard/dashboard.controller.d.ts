import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(): Promise<{
        success: boolean;
        data: {
            kpis: {
                totalRevenue: number;
                totalProfit: number;
                profitMargin: number;
                inventoryValue: number;
                prevRevenue: number;
                totalOrders: number;
                prevOrders: number;
                activeClients: number;
                prevClients: number;
                averageCart: number;
                completedOrders: number;
                healthStatus: string;
            };
            charts: {
                monthlyRevenue: any[];
                productSales: any[];
                orderStatusBreakdown: any[];
                customerGrowth: any[];
                wilayaDistribution: any[];
                paymentMethodDistribution: any[];
            };
            alerts: {
                lowStockProducts: any[];
            };
            error?: undefined;
        } | {
            error: any;
            kpis?: undefined;
            charts?: undefined;
            alerts?: undefined;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
}
