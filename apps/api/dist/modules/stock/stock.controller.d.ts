import { StockService } from './stock.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
export declare class StockController {
    private stockService;
    constructor(stockService: StockService);
    getMovements(productId?: string): Promise<{
        statusCode: number;
        data: import("../../database/entities").StockMovement[];
    }>;
    getAlerts(): Promise<{
        statusCode: number;
        data: import("../../database/entities").Product[];
    }>;
    adjust(adjustStockDto: AdjustStockDto): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").StockMovement;
    }>;
}
