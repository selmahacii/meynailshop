import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    dashboard(): Promise<{
        statusCode: number;
        data: {
            totalOrders: number;
            totalRevenue: any;
            activeProducts: number;
            timestamp: Date;
        };
    }>;
    sales(period?: string): Promise<{
        statusCode: number;
        data: import("../../database/entities").Order[];
    }>;
}
