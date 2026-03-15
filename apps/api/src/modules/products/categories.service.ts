import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
      console.log('🔍 [CategoriesService] Fetching all categories...');
      const categories = await this.categoryRepository.find();
      console.log(`✅ [CategoriesService] Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      console.error('❌ [CategoriesService] findAll Error:', error);
      // Retourner un tableau vide au lieu de crash, pour que l'API reste à 200
      return [];
    }
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
}
