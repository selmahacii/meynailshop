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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../../database/entities/product.entity");
const category_entity_1 = require("../../database/entities/category.entity");
const slug_util_1 = require("../../common/utils/slug.util");
let ProductsService = class ProductsService {
    constructor(productRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }
    async generateNextSku() {
        const lastProduct = await this.productRepository.createQueryBuilder('product')
            .where("product.sku LIKE 'MEEY-%'")
            .orderBy("SUBSTRING(product.sku, 6)::INTEGER", "DESC")
            .getOne();
        let nextNumber = 1;
        if (lastProduct && lastProduct.sku) {
            const parts = lastProduct.sku.split('-');
            if (parts.length > 1) {
                const currentNumber = parseInt(parts[1]);
                if (!isNaN(currentNumber)) {
                    nextNumber = currentNumber + 1;
                }
            }
        }
        return `MEEY-${nextNumber.toString().padStart(3, '0')}`;
    }
    async create(createProductDto) {
        const slug = createProductDto.slug || (0, slug_util_1.generateSlug)(createProductDto.name);
        const sku = await this.generateNextSku();
        const existingProduct = await this.productRepository.createQueryBuilder('product')
            .where('product.slug = :slug OR product.sku = :sku', { slug, sku })
            .getOne();
        if (existingProduct) {
            throw new common_1.BadRequestException('Product with this slug or SKU already exists');
        }
        let variants = createProductDto.variants;
        if (variants && Array.isArray(variants)) {
            variants = variants.map((v) => ({ sku: v.sku, image: v.image }));
        }
        const product = this.productRepository.create({
            ...createProductDto,
            sku,
            slug,
            variants
        });
        return await this.productRepository.save(product);
    }
    async findAll(query) {
        const skip = (query.page - 1) * query.limit;
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .where('product.isActive = :isActive', { isActive: true });
        if (query.search) {
            queryBuilder.andWhere('product.name ILIKE :search', { search: `%${query.search}%` });
        }
        if (query.category) {
            queryBuilder.andWhere('category.slug = :category', { category: query.category });
        }
        if (query.subCategory) {
            queryBuilder.andWhere('subCategory.slug = :subCategory', { subCategory: query.subCategory });
        }
        if (query.minPrice !== undefined && query.minPrice !== null) {
            queryBuilder.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
        }
        if (query.maxPrice !== undefined && query.maxPrice !== null) {
            queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
        }
        if (query.badge) {
            queryBuilder.andWhere('product.badge = :badge', { badge: query.badge });
        }
        if (query.inStock === 'true') {
            queryBuilder.andWhere('product.stock > 0');
        }
        if (query.sortBy) {
            const sortField = query.sortBy === 'createdAt' ? 'product.createdAt' : `product.${query.sortBy}`;
            queryBuilder.orderBy(sortField, query.order === 'asc' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.orderBy('product.createdAt', 'DESC');
        }
        const [products, total] = await queryBuilder
            .skip(skip)
            .take(query.limit)
            .getManyAndCount();
        return {
            items: products,
            total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(total / query.limit),
            hasNext: skip + query.limit < total,
            hasPrev: query.page > 1,
        };
    }
    async findBySlug(slug) {
        const product = await this.productRepository.findOne({
            where: { slug, isActive: true },
            relations: ['category', 'subCategory'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findFeatured(limit = 6) {
        try {
            let products = await this.productRepository.find({
                where: [
                    { isFeatured: true, isActive: true },
                    { badge: 'top', isActive: true }
                ],
                relations: ['category'],
                take: limit,
                order: { createdAt: 'DESC' },
            });
            if (products.length === 0) {
                products = await this.productRepository.find({
                    where: { isActive: true },
                    relations: ['category'],
                    take: limit,
                    order: { createdAt: 'DESC' },
                });
            }
            return products;
        }
        catch (error) {
            console.error('❌ [ProductsService] findFeatured Error:', error);
            try {
                return await this.productRepository.find({
                    where: { isActive: true },
                    take: limit,
                    order: { createdAt: 'DESC' },
                });
            }
            catch (innerError) {
                console.error('❌ [ProductsService] Critical Fallback Error:', innerError);
                return [];
            }
        }
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'subCategory'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            throw new common_1.BadRequestException('Le SKU principal (MEEY) ne peut pas être modifié');
        }
        if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
            const existed = await this.productRepository.findOne({
                where: { slug: updateProductDto.slug },
            });
            if (existed) {
                throw new common_1.BadRequestException('Slug already exists');
            }
        }
        const { sku, ...updateData } = updateProductDto;
        if (updateData.variants && Array.isArray(updateData.variants)) {
            updateData.variants = updateData.variants.map((v) => ({ sku: v.sku, image: v.image }));
        }
        Object.assign(product, updateData);
        return await this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.isActive = false;
        await this.productRepository.save(product);
        return { message: 'Product deactivated' };
    }
    async updateStock(id, quantity) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.stock = quantity;
        return await this.productRepository.save(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map