import { BadgeType } from './api';

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  categoryId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  costPrice: number;
  stock: number;
  stockAlert: number;
  images: string[];
  categoryId: string;
  subCategoryId: string | null;
  badge: BadgeType | null;
  isActive: boolean;
  isFeatured: boolean;
  weight: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  subCategories?: SubCategory[];
}

export interface ProductResponse extends Omit<Product, 'costPrice'> {
  category?: Category;
  subCategory?: SubCategory;
  reviewCount?: number;
  averageRating?: number;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice: number;
  stock: number;
  stockAlert: number;
  images: string[];
  categoryId: string;
  subCategoryId?: string | null;
  badge?: BadgeType;
  isActive: boolean;
  isFeatured: boolean;
  weight: number;
  tags: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
