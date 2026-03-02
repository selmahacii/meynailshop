import apiClient from './client';
import { Product, Category } from '@/types/product';
import { PaginatedData } from '@/types/api';

export const productsApi = {
  getAll: (params?: any) =>
    apiClient.get<any, { data: PaginatedData<Product> }>('/products', { params }),
  getBySlug: (slug: string) =>
    apiClient.get<any, { data: Product }>(`/products/${slug}`),
  getFeatured: () =>
    apiClient.get<any, { data: Product[] }>('/products/featured'),
  getCategories: () =>
    apiClient.get<any, { data: Category[] }>('/categories'),
};
