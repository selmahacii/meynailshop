import { Category } from './category.entity';
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
    badge: 'top' | 'new' | 'promo' | null;
    isActive: boolean;
    isFeatured: boolean;
    weight: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    category: Category;
}
