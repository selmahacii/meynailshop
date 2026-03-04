import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

export function useProducts(params?: any) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug).then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeatured().then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories().then(r => r.data),
    staleTime: 30 * 60 * 1000,
  });
}
