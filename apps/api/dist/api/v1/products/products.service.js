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
const product_entity_1 = require("../../../database/entities/product.entity");
const slug_util_1 = require("../../../common/utils/slug.util");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
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
    async findAll(page = 1, limit = 10, search) {
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory');
        if (search) {
            const searchPattern = `%${search}%`;
            queryBuilder.where('(product.name ILIKE :search OR product.sku ILIKE :search OR category.name ILIKE :search OR subCategory.name ILIKE :search)', { search: searchPattern });
        }
        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('product.createdAt', 'DESC')
            .getManyAndCount();
        const data = items.map(p => {
            let status = 'in_stock';
            if (p.stock <= 0)
                status = 'out_of_stock';
            else if (p.stock <= (p.stockAlert || 5))
                status = 'low_stock';
            return {
                ...p,
                sku: p.sku && p.sku.trim() !== '' ? p.sku : `REF-${p.id.slice(0, 6).toUpperCase()}`,
                category: typeof p.category === 'object' ? p.category?.name : (p.category || '—'),
                subCategory: typeof p.subCategory === 'object' ? p.subCategory?.name : (p.subCategory || '—'),
                status,
                alertThreshold: p.stockAlert || 5
            };
        });
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        return product;
    }
    async create(createProductDto) {
        const slug = createProductDto.slug || (0, slug_util_1.generateSlug)(createProductDto.name);
        let sku = createProductDto.sku;
        if (!sku || sku.trim() === '') {
            sku = await this.generateNextSku();
        }
        const existingProduct = await this.productRepository.createQueryBuilder('product')
            .where('product.slug = :slug OR product.sku = :sku', { slug, sku })
            .getOne();
        if (existingProduct) {
            if (!createProductDto.sku || createProductDto.sku.trim() === '') {
                sku = await this.generateNextSku();
            }
            else {
                throw new common_1.BadRequestException('Un produit avec ce SKU ou ce Slug existe déjà');
            }
        }
        let variants = createProductDto.variants;
        if (variants && Array.isArray(variants)) {
            variants = variants.map((v) => ({
                sku: v.sku,
                image: v.image,
                stock: v.stock || 0,
                stockAlert: v.stockAlert || createProductDto.stockAlert || 5
            }));
        }
        const product = this.productRepository.create({
            ...createProductDto,
            sku,
            slug,
            variants
        });
        return await this.productRepository.save(product);
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException('Produit non trouvé');
        }
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            throw new common_1.BadRequestException('Le SKU principal (MEEY) ne peut pas être modifié');
        }
        if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
            const existed = await this.productRepository.findOne({
                where: { slug: updateProductDto.slug },
            });
            if (existed && existed.id !== id) {
                throw new common_1.BadRequestException('Un produit avec ce Slug existe déjà');
            }
        }
        const { sku, ...updateData } = updateProductDto;
        if (updateData.variants && Array.isArray(updateData.variants)) {
            updateData.variants = updateData.variants.map((v) => ({
                sku: v.sku,
                image: v.image,
                stock: v.stock || 0,
                stockAlert: v.stockAlert || updateData.stockAlert || product.stockAlert || 5
            }));
        }
        Object.assign(product, updateData);
        return await this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return { success: true };
    }
    async getLowStockProducts(threshold = 5) {
        const products = await this.productRepository
            .createQueryBuilder('p')
            .where('(p.stock <= :threshold OR p."hasVariants" = true)', { threshold })
            .andWhere('p.isActive = :isActive', { isActive: true })
            .getMany();
        const results = [];
        for (const p of products) {
            if (!p.hasVariants) {
                if (p.stock <= (p.stockAlert || threshold)) {
                    results.push({ ...p, isVariant: false });
                }
            }
            else if (p.variants && Array.isArray(p.variants)) {
                for (const v of p.variants) {
                    const vThreshold = v.stockAlert || p.stockAlert || threshold;
                    if (v.stock <= vThreshold) {
                        results.push({
                            id: `${p.id}-${v.sku}`,
                            name: `${p.name} (${v.sku})`,
                            stock: v.stock,
                            sku: v.sku,
                            isVariant: true,
                            productId: p.id,
                            stockAlert: vThreshold
                        });
                    }
                }
            }
        }
        return results.sort((a, b) => a.stock - b.stock).slice(0, 10);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map