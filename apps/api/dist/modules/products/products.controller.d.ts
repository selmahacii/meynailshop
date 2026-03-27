import { ProductsService } from './products.service';
import { CategoriesService } from './categories.service';
import { ProductsQueryDto } from './dto/products-query.dto';
export declare class StoreProductsController {
    private productsService;
    private categoriesService;
    constructor(productsService: ProductsService, categoriesService: CategoriesService);
    findAll(query: ProductsQueryDto): Promise<{
        statusCode: number;
        data: import("../../common/pagination/paginated-result.interface").PaginatedResult<import("../../database/entities").Product>;
    }>;
    featured(): Promise<{
        statusCode: number;
        data: import("../../database/entities").Product[];
    }>;
    findBySlug(slug: string): Promise<{
        statusCode: number;
        data: import("../../database/entities").Product;
    }>;
    create(createProductDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Product[];
    }>;
    update(id: string, updateProductDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Product;
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
        data: import("../../database/entities").Product;
    }>;
}
