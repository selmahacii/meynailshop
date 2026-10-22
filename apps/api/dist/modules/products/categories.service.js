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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
const slug_util_1 = require("../../common/utils/slug.util");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, subCategoryRepository, productRepository) {
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.productRepository = productRepository;
    }
    async create(createCategoryDto) {
        const slug = createCategoryDto.slug || (0, slug_util_1.generateSlug)(createCategoryDto.name);
        const existingCategory = await this.categoryRepository.findOne({
            where: [{ slug }, { name: createCategoryDto.name }],
        });
        if (existingCategory) {
            throw new common_1.BadRequestException('Category already exists');
        }
        const category = this.categoryRepository.create({
            ...createCategoryDto,
            slug,
        });
        return await this.categoryRepository.save(category);
    }
    async findAll() {
        try {
            const categories = await this.categoryRepository.find({
                where: { isActive: true },
                relations: ['subCategories', 'subCategories.products'],
                order: { displayOrder: 'ASC' }
            });
            return categories.map(cat => ({
                ...cat,
                subCategories: (cat.subCategories || [])
                    .filter(sub => sub.isActive)
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map(sub => {
                    const { products, ...subRest } = sub;
                    return {
                        ...subRest,
                        productsCount: products ? products.length : 0
                    };
                })
            }));
        }
        catch (error) {
            console.error('❌ [CategoriesService] findAll Error:', error);
            return [];
        }
    }
    async createSubCategory(categoryId, data) {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        const slug = data.slug || (0, slug_util_1.generateSlug)(data.name);
        const existing = await this.subCategoryRepository.findOne({ where: { slug } });
        if (existing)
            throw new common_1.BadRequestException('SubCategory with this slug already exists');
        const subCategory = this.subCategoryRepository.create({
            ...data,
            slug,
            categoryId
        });
        return await this.subCategoryRepository.save(subCategory);
    }
    async findSubBySlug(slug) {
        const raw = slug.trim();
        const clean = raw.toLowerCase().replace(/--+/g, '-');
        const doubleDash = clean.replace(/-/g, '--');
        const slugs = Array.from(new Set([raw, clean, doubleDash, raw.toLowerCase()]));
        const sub = await this.subCategoryRepository
            .createQueryBuilder('sub')
            .leftJoinAndSelect('sub.products', 'products')
            .leftJoinAndSelect('sub.category', 'category')
            .where('sub.isActive = :isActive', { isActive: true })
            .andWhere('sub.slug IN (:...slugs)', { slugs })
            .getOne();
        if (!sub)
            throw new common_1.NotFoundException('SubCategory not found');
        return sub;
    }
    async findBySlug(slug) {
        const raw = slug.trim();
        const clean = raw.toLowerCase().replace(/--+/g, '-');
        const doubleDash = clean.replace(/-/g, '--');
        const slugs = Array.from(new Set([raw, clean, doubleDash, raw.toLowerCase()]));
        const category = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.subCategories', 'subCategory', 'subCategory.isActive = :subActive', { subActive: true })
            .leftJoinAndSelect('subCategory.products', 'product')
            .where('category.isActive = :isActive', { isActive: true })
            .andWhere('category.slug IN (:...slugs)', { slugs })
            .orderBy('subCategory.displayOrder', 'ASC')
            .getOne();
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const activeSubs = (category.subCategories || [])
            .filter(sub => sub.isActive)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        const subCategories = activeSubs.map(sub => {
            const productCount = sub.products ? sub.products.length : 0;
            const hasNewArrivals = sub.products?.some(p => p.badge === 'new' || p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
            const { products, ...rest } = sub;
            return {
                ...rest,
                productCount,
                hasNewArrivals
            };
        });
        return {
            ...category,
            subCategories
        };
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        category.isActive = false;
        await this.categoryRepository.save(category);
        return { message: 'Category deactivated' };
    }
    async removeSubCategory(id) {
        const sub = await this.subCategoryRepository.findOne({ where: { id } });
        if (!sub)
            throw new common_1.NotFoundException('SubCategory not found');
        return await this.subCategoryRepository.remove(sub);
    }
    async updateSubCategory(id, data) {
        const sub = await this.subCategoryRepository.findOne({ where: { id } });
        if (!sub)
            throw new common_1.NotFoundException('SubCategory not found');
        if (data.categoryId && data.categoryId !== sub.categoryId) {
            const parentCat = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
            if (!parentCat)
                throw new common_1.NotFoundException('New parent category not found');
            sub.categoryId = data.categoryId;
            await this.productRepository.update({ subCategoryId: id }, { categoryId: data.categoryId });
        }
        if (data.name !== undefined)
            sub.name = data.name;
        if (data.slug !== undefined)
            sub.slug = data.slug;
        if (data.imageUrl !== undefined)
            sub.imageUrl = data.imageUrl;
        if (data.description !== undefined)
            sub.description = data.description;
        if (data.displayOrder !== undefined)
            sub.displayOrder = data.displayOrder;
        if (data.isActive !== undefined)
            sub.isActive = data.isActive;
        return await this.subCategoryRepository.save(sub);
    }
    async getSubCategoryProducts(subCategoryId) {
        const sub = await this.subCategoryRepository.findOne({ where: { id: subCategoryId } });
        if (!sub)
            throw new common_1.NotFoundException('SubCategory not found');
        return await this.productRepository.find({
            where: { subCategoryId },
            order: { createdAt: 'DESC' },
        });
    }
    async assignProductsToSubCategory(subCategoryId, productIds) {
        const sub = await this.subCategoryRepository.findOne({ where: { id: subCategoryId } });
        if (!sub)
            throw new common_1.NotFoundException('SubCategory not found');
        if (!productIds || productIds.length === 0) {
            return { success: true, count: 0 };
        }
        const updateRes = await this.productRepository.update({ id: (0, typeorm_2.In)(productIds) }, {
            subCategoryId: sub.id,
            categoryId: sub.categoryId,
        });
        return {
            success: true,
            count: updateRes.affected || 0,
            subCategory: sub,
        };
    }
    async removeProductFromSubCategory(subCategoryId, productId) {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.subCategoryId === subCategoryId) {
            product.subCategoryId = null;
            await this.productRepository.save(product);
        }
        return { success: true, message: 'Product detached from sub-category' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.SubCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map