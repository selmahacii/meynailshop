"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const product_filter_dto_1 = require("./dtos/product-filter.dto");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        const { category, minPrice, maxPrice, search, inStock, sort, page = 1, limit = 12 } = filter;
        const where = {};
        if (category) {
            where.category = { slug: category };
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
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
        let orderBy = {};
        switch (sort) {
            case product_filter_dto_1.ProductSortBy.PRICE_ASC:
                orderBy = { price: 'asc' };
                break;
            case product_filter_dto_1.ProductSortBy.PRICE_DESC:
                orderBy = { price: 'desc' };
                break;
            case product_filter_dto_1.ProductSortBy.NEWEST:
                orderBy = { createdAt: 'desc' };
                break;
            case product_filter_dto_1.ProductSortBy.RATING:
                orderBy = { rating: 'desc' };
                break;
            case product_filter_dto_1.ProductSortBy.POPULAR:
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
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
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
    async create(dto) {
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
    async validateStock(productId, quantity) {
        const result = await this.prisma.$queryRaw `SELECT id, stock FROM "Product" WHERE id = ${productId} FOR UPDATE`;
        if (!result.length) {
            throw new common_1.NotFoundException('Product not found');
        }
        const product = result[0];
        return {
            valid: product.stock >= quantity,
            currentStock: product.stock,
            productId,
        };
    }
    async updateStock(id, stock) {
        return this.prisma.product.update({
            where: { id },
            data: { stock },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map