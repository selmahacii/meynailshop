import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, SubCategory } from '../../database/entities';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
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
      return await this.categoryRepository.find({
        where: { isActive: true },
        relations: ['subCategories'],
        order: { displayOrder: 'ASC' }
      });
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
    const sub = await this.subCategoryRepository.findOne({
      where: { slug, isActive: true },
      relations: ['products', 'category']
    });
    if (!sub) throw new NotFoundException('SubCategory not found');
    return sub;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
      relations: ['products'],
      });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
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
    Object.assign(sub, data);
    return await this.subCategoryRepository.save(sub);
  }
}
