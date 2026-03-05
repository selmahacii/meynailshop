import { Product } from './product.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    products: Product[];
}
