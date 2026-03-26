import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        statusCode: number;
        data: import("../../database/entities").Category[];
    }>;
    findBySlug(slug: string): Promise<{
        statusCode: number;
        data: {
            subCategories: {
                productCount: number;
                hasNewArrivals: boolean;
                id: string;
                name: string;
                slug: string;
                description: string;
                displayOrder: number;
                isActive: boolean;
                imageUrl: string;
                categoryId: string;
                category: import("../../database/entities").Category;
            }[];
            id: string;
            name: string;
            slug: string;
            description: string;
            imageUrl: string;
            displayOrder: number;
            isActive: boolean;
            createdAt: Date;
            products: import("../../database/entities").Product[];
        };
    }>;
    create(createCategoryDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Category[];
    }>;
    update(id: string, updateCategoryDto: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../database/entities").Category;
    }>;
    remove(id: string): Promise<{
        statusCode: number;
        data: {
            message: string;
        };
    }>;
    createSub(id: string, data: any): Promise<{
        statusCode: number;
        data: import("../../database/entities").SubCategory[];
    }>;
    removeSub(id: string): Promise<{
        statusCode: number;
        data: import("../../database/entities").SubCategory;
    }>;
    updateSub(id: string, data: any): Promise<{
        statusCode: number;
        data: import("../../database/entities").SubCategory;
    }>;
}
