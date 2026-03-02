import { Repository } from 'typeorm';
import { StockMovement } from '../../database/entities/stock-movement.entity';
import { Product } from '../../database/entities/product.entity';
export declare class StockService {
    private stockMovementRepository;
    private productRepository;
    constructor(stockMovementRepository: Repository<StockMovement>, productRepository: Repository<Product>);
    adjustStock(productId: string, quantity: number, reason: string, reference?: string): Promise<StockMovement>;
    getMovements(productId?: string): Promise<StockMovement[]>;
    getAlerts(alertThreshold?: number): Promise<Product[]>;
}
