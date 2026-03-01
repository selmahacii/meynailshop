import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProductFilterDto, ProductSortBy } from './dtos/product-filter.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filter: ProductFilterDto) {
        const { category, minPrice, maxPrice, search, inStock, sort, page = 1, limit = 12 } = filter;

        const where: Prisma.ProductWhereInput = {};

        if (category) {
            where.category = { slug: category };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search.toLowerCase()] } },
            ];
        }

        if (inStock) {
            where.stock = { gt: 0 };
        }

        // Sorting
        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        switch (sort) {
            case ProductSortBy.PRICE_ASC:
                orderBy = { price: 'asc' };
                break;
            case ProductSortBy.PRICE_DESC:
                orderBy = { price: 'desc' };
                break;
            case ProductSortBy.NEWEST:
                orderBy = { createdAt: 'desc' };
                break;
            case ProductSortBy.RATING:
                orderBy = { rating: 'desc' };
                break;
            case ProductSortBy.POPULAR:
            default:
                orderBy = { reviewCount: 'desc' };
                break;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async findTopSellers(limit = 8) {
        return this.prisma.product.findMany({
            where: { isTopSeller: true },
            orderBy: { reviewCount: 'desc' },
            take: limit,
            include: { category: true },
        });
    }

    async findFeatured() {
        return this.prisma.product.findMany({
            where: { isFeatured: true },
            include: { category: true },
        });
    }

    async create(dto: CreateProductDto) {
        const slug = dto.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        return this.prisma.product.create({
            data: {
                ...dto,
                slug,
                price: dto.price,
                compareAtPrice: dto.compareAtPrice,
            },
            include: { category: true },
        });
    }

    async validateStock(productId: string, quantity: number) {
        // Use raw query with FOR UPDATE for atomic stock check
        const result = await this.prisma.$queryRaw<
            { id: string; stock: number }[]
        >`SELECT id, stock FROM "Product" WHERE id = ${productId} FOR UPDATE`;

        if (!result.length) {
            throw new NotFoundException('Product not found');
        }

        const product = result[0];
        return {
            valid: product.stock >= quantity,
            currentStock: product.stock,
            productId,
        };
    }

    async updateStock(id: string, stock: number) {
        return this.prisma.product.update({
            where: { id },
            data: { stock },
        });
    }
}
