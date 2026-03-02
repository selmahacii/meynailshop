import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        statusCode: number;
        data: import("../../database/entities/category.entity").Category[];
    }>;
    findBySlug(slug: string): Promise<{
        statusCode: number;
        data: import("../../database/entities/category.entity").Category;
    }>;
    create(createCategoryDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/category.entity").Category[];
    }>;
    update(id: string, updateCategoryDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities/category.entity").Category;
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        data: {
            message: string;
        };
    }>;
}
