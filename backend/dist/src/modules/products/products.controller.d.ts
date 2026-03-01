import { ProductsService } from './products.service';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { CreateProductDto } from './dtos/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filter: ProductFilterDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                image: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            isFeatured: boolean;
            isTopSeller: boolean;
            compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            lowStockThreshold: number;
            rating: import("@prisma/client/runtime/library").Decimal;
            reviewCount: number;
            tags: string[];
            sku: string | null;
            categoryId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findTopSellers(limit?: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        isTopSeller: boolean;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    })[]>;
    findFeatured(): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        isTopSeller: boolean;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    })[]>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            sku: string;
            productId: string;
            color: string | null;
            size: string | null;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        isTopSeller: boolean;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
    create(dto: CreateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            image: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        isTopSeller: boolean;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
    updateStock(id: string, stock: number): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        isFeatured: boolean;
        isTopSeller: boolean;
        compareAtPrice: import("@prisma/client/runtime/library").Decimal | null;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
}
