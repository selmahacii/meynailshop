import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { ProductsQueryDto } from './dto/products-query.dto';
export declare class ProductsController {
    private productsService;
    private categoriesService;
    constructor(productsService: ProductsService, categoriesService: CategoriesService);
    findAll(query: ProductsQueryDto): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<import("../../database/entities/product.entity").Product>;
    }>;
    featured(): Promise<{
        statusCode: number;
        data: import("../../database/entities/product.entity").Product[];
    }>;
    findBySlug(slug: string): Promise<{
        statusCode: number;
        data: import("../../database/entities/product.entity").Product;
    }>;
    create(createProductDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/product.entity").Product;
    }>;
    update(id: string, updateProductDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/product.entity").Product;
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        data: {
            message: string;
        };
    }>;
    updateStock(id: string, updateStockDto: {
        quantity: number;
    }): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/product.entity").Product;
    }>;
}
