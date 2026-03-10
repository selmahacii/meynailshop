import { apiGet } from './client';
import { Product, Category } from '@/types/product';
import { PaginatedData } from '@/types/api';

export const productsApi = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiGet<{ data: PaginatedData<Product> }>(`/products${query}`);
  },
  getBySlug: (slug: string) =>
    apiGet<{ data: Product }>(`/products/${slug}`),
  getFeatured: () =>
    apiGet<{ data: Product[] }>('/products/featured'),
  getCategories: () =>
    apiGet<{ data: Category[] }>('/categories'),
};
