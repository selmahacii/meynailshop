import { Repository } from 'typeorm';
import { Category, SubCategory } from '../../database/entities';
export declare class CategoriesService {
    private categoryRepository;
    private subCategoryRepository;
    constructor(categoryRepository: Repository<Category>, subCategoryRepository: Repository<SubCategory>);
    create(createCategoryDto: any): Promise<Category[]>;
    findAll(): Promise<Category[]>;
    createSubCategory(categoryId: string, data: any): Promise<SubCategory[]>;
    findSubBySlug(slug: string): Promise<SubCategory>;
    findBySlug(slug: string): Promise<Category>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: any): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeSubCategory(id: string): Promise<SubCategory>;
    updateSubCategory(id: string, data: any): Promise<SubCategory>;
}
