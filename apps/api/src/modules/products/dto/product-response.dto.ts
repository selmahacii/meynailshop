export class ProductResponseDto {
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
  category?: { id: string; name: string };
  badge?: 'top' | 'new' | 'promo';
  isActive: boolean;
  isFeatured: boolean;
  weight: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  reviewCount?: number;
  averageRating?: number;
}
