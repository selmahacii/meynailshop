import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(): Promise<{
        success: boolean;
        data: {
            kpis: {
                totalRevenue: number;
                totalOrders: number;
                activeClients: number;
                averageCart: number;
                completedOrders: number;
            };
            charts: {
                monthlyRevenue: any[];
                productSales: any[];
                orderStatusBreakdown: any[];
                customerGrowth: any[];
            };
            alerts: {
                lowStockProducts: any[];
            };
        };
    }>;
}
