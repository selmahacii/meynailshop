import { BadgeType } from './api';

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
}

export interface ProductResponse extends Omit<Product, 'costPrice'> {
  category?: Category;
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
  badge?: BadgeType;
  isActive: boolean;
  isFeatured: boolean;
  weight: number;
  tags: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
