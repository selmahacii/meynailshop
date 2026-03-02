import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
export declare class CategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(createCategoryDto: any): Promise<Category[]>;
    findAll(): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: any): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
