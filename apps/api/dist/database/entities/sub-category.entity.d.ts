import { Category } from './category.entity';
import { Product } from './product.entity';
export declare class SubCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    displayOrder: number;
    isActive: boolean;
    imageUrl: string;
    categoryId: string;
    category: Category;
    products: Product[];
}
