import { Repository } from 'typeorm';
import { Category, SubCategory, Product } from '../../database/entities';
export declare class CategoriesService {
    private categoryRepository;
    private subCategoryRepository;
    private productRepository;
    constructor(categoryRepository: Repository<Category>, subCategoryRepository: Repository<SubCategory>, productRepository: Repository<Product>);
    create(createCategoryDto: any): Promise<Category[]>;
    findAll(): Promise<Category[]>;
    createSubCategory(categoryId: string, data: any): Promise<SubCategory[]>;
    findSubBySlug(slug: string): Promise<SubCategory>;
    findBySlug(slug: string): Promise<{
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
            category: Category;
        }[];
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        products: Product[];
    }>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: any): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeSubCategory(id: string): Promise<SubCategory>;
    updateSubCategory(id: string, data: any): Promise<SubCategory>;
    getSubCategoryProducts(subCategoryId: string): Promise<Product[]>;
    assignProductsToSubCategory(subCategoryId: string, productIds: string[]): Promise<{
        success: boolean;
        count: number;
        subCategory?: undefined;
    } | {
        success: boolean;
        count: number;
        subCategory: SubCategory;
    }>;
    removeProductFromSubCategory(subCategoryId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
