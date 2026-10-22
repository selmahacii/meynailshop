import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Category, SubCategory, Product } from '../../database/entities';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createCategoryDto: any) {
    const slug = createCategoryDto.slug || generateSlug(createCategoryDto.name);

    const existingCategory = await this.categoryRepository.findOne({
      where: [{ slug }, { name: createCategoryDto.name }],
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
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
    } catch (error) {
      console.error('❌ [CategoriesService] findAll Error:', error);
      return [];
    }
  }

  async createSubCategory(categoryId: string, data: any) {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const slug = data.slug || generateSlug(data.name);
    const existing = await this.subCategoryRepository.findOne({ where: { slug } });
    if (existing) throw new BadRequestException('SubCategory with this slug already exists');

    const subCategory = this.subCategoryRepository.create({
      ...data,
      slug,
      categoryId
    });

    return await this.subCategoryRepository.save(subCategory);
  }

  async findSubBySlug(slug: string) {
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

    if (!sub) throw new NotFoundException('SubCategory not found');
    return sub;
  }

  async findBySlug(slug: string) {
    const raw = slug.trim();
    const clean = raw.toLowerCase().replace(/--+/g, '-');
    const doubleDash = clean.replace(/-/g, '--');
    const slugs = Array.from(new Set([raw, clean, doubleDash, raw.toLowerCase()]));

    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .leftJoinAndSelect('subCategory.products', 'product')
      .where('category.isActive = :isActive', { isActive: true })
      .andWhere('category.slug IN (:...slugs)', { slugs })
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Enrich subcategories with product count and "isNew" flag
    const subCategories = category.subCategories.map(sub => {
      const productCount = sub.products ? sub.products.length : 0;
      const hasNewArrivals = sub.products?.some(p => p.badge === 'new' || p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      
      // Clean up products to avoid sending too much data
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

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: any) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.isActive = false;
    await this.categoryRepository.save(category);
    return { message: 'Category deactivated' };
  }

  async removeSubCategory(id: string) {
    const sub = await this.subCategoryRepository.findOne({ where: { id } });
    if (!sub) throw new NotFoundException('SubCategory not found');
    return await this.subCategoryRepository.remove(sub);
  }

  async updateSubCategory(id: string, data: any) {
    const sub = await this.subCategoryRepository.findOne({ where: { id } });
    if (!sub) throw new NotFoundException('SubCategory not found');

    if (data.categoryId && data.categoryId !== sub.categoryId) {
      const parentCat = await this.categoryRepository.findOne({ where: { id: data.categoryId } });
      if (!parentCat) throw new NotFoundException('New parent category not found');

      sub.categoryId = data.categoryId;

      // Also transfer all existing products of this subcategory to the new parent category
      await this.productRepository.update(
        { subCategoryId: id },
        { categoryId: data.categoryId }
      );
    }

    if (data.name !== undefined) sub.name = data.name;
    if (data.slug !== undefined) sub.slug = data.slug;
    if (data.imageUrl !== undefined) sub.imageUrl = data.imageUrl;
    if (data.description !== undefined) sub.description = data.description;
    if (data.displayOrder !== undefined) sub.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) sub.isActive = data.isActive;

    return await this.subCategoryRepository.save(sub);
  }

  async getSubCategoryProducts(subCategoryId: string) {
    const sub = await this.subCategoryRepository.findOne({ where: { id: subCategoryId } });
    if (!sub) throw new NotFoundException('SubCategory not found');

    return await this.productRepository.find({
      where: { subCategoryId },
      order: { createdAt: 'DESC' },
    });
  }

  async assignProductsToSubCategory(subCategoryId: string, productIds: string[]) {
    const sub = await this.subCategoryRepository.findOne({ where: { id: subCategoryId } });
    if (!sub) throw new NotFoundException('SubCategory not found');

    if (!productIds || productIds.length === 0) {
      return { success: true, count: 0 };
    }

    const updateRes = await this.productRepository.update(
      { id: In(productIds) },
      {
        subCategoryId: sub.id,
        categoryId: sub.categoryId,
      }
    );

    return {
      success: true,
      count: updateRes.affected || 0,
      subCategory: sub,
    };
  }

  async removeProductFromSubCategory(subCategoryId: string, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    if (product.subCategoryId === subCategoryId) {
      product.subCategoryId = null as any;
      await this.productRepository.save(product);
    }

    return { success: true, message: 'Product detached from sub-category' };
  }
}
