export type BadgeType = 'top' | 'new' | 'promo';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  badge?: BadgeType;
  isActive: boolean;
  isFeatured: boolean;
  weight: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  reviewCount?: number;
  averageRating?: number;
}
