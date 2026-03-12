import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(): Promise<{
        success: boolean;
        data: {
            kpis: {
                totalRevenue: number;
                prevRevenue: number;
                totalOrders: number;
                prevOrders: number;
                activeClients: number;
                prevClients: number;
                averageCart: number;
                completedOrders: number;
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
        };
    }>;
}
