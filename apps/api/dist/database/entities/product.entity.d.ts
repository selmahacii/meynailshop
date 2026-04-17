import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';
export declare class Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    sku: string;
    price: number;
    comparePrice: number;
    costPrice: number;
    stock: number;
    stockAlert: number;
    images: string[];
    categoryId: string;
    subCategoryId: string;
    badge: 'top' | 'new' | 'promo' | null;
    isActive: boolean;
    isFeatured: boolean;
    weight: number;
    tags: string[];
    hasVariants: boolean;
    variants: {
        sku: string;
        image: string;
        stock: number;
        stockAlert: number;
    }[] | null;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    subCategory: SubCategory;
}
