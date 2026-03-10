import { Repository } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(page?: number, limit?: number): Promise<{
        data: Product[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<Product>;
    create(createProductDto: any): Promise<Product[]>;
    update(id: string, updateProductDto: any): Promise<Product>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getLowStockProducts(threshold?: number): Promise<Product[]>;
}
