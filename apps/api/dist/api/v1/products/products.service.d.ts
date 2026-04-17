import { Repository } from 'typeorm';
import { Product } from '../../../database/entities/product.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    private generateNextSku;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            sku: string;
            category: any;
            subCategory: any;
            status: "in_stock" | "low_stock" | "out_of_stock";
            alertThreshold: number;
            id: string;
            name: string;
            slug: string;
            description: string;
            shortDescription: string;
            price: number;
            comparePrice: number;
            costPrice: number;
            stock: number;
            stockAlert: number;
            images: string[];
            categoryId: string;
            subCategoryId: string;
            badge: "top" | "new" | "promo" | null;
            isActive: boolean;
            isFeatured: boolean;
            weight: number;
            tags: string[];
            hasVariants: boolean;
            variants: {
                sku: string;
                image: string;
                stock: number;
                stockAlert: number;
            }[] | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
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
    getLowStockProducts(threshold?: number): Promise<any[]>;
}
