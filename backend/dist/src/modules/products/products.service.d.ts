import { PrismaService } from '../../database/prisma.service';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
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
            compareAtPrice: Prisma.Decimal | null;
            price: Prisma.Decimal;
            images: string[];
            stock: number;
            lowStockThreshold: number;
            rating: Prisma.Decimal;
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
            price: Prisma.Decimal;
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
        compareAtPrice: Prisma.Decimal | null;
        price: Prisma.Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: Prisma.Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
    findTopSellers(limit?: number): Promise<({
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
        compareAtPrice: Prisma.Decimal | null;
        price: Prisma.Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: Prisma.Decimal;
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
        compareAtPrice: Prisma.Decimal | null;
        price: Prisma.Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: Prisma.Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    })[]>;
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
        compareAtPrice: Prisma.Decimal | null;
        price: Prisma.Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: Prisma.Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
    validateStock(productId: string, quantity: number): Promise<{
        valid: boolean;
        currentStock: number;
        productId: string;
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
        compareAtPrice: Prisma.Decimal | null;
        price: Prisma.Decimal;
        images: string[];
        stock: number;
        lowStockThreshold: number;
        rating: Prisma.Decimal;
        reviewCount: number;
        tags: string[];
        sku: string | null;
        categoryId: string;
    }>;
}
