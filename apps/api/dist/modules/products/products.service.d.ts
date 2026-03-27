import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';
import { PaginatedResult } from '../../common/pagination/paginated-result.interface';
import { ProductsQueryDto } from './dto/products-query.dto';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>);
    private generateNextSku;
    create(createProductDto: any): Promise<Product[]>;
    findAll(query: ProductsQueryDto): Promise<PaginatedResult<Product>>;
    findBySlug(slug: string): Promise<Product>;
    findFeatured(limit?: number): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: any): Promise<Product>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number): Promise<Product>;
}
