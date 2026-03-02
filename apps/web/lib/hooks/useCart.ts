import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/cart';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart().then(r => r.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  
  return {
    addItem: useMutation({
      mutationFn: (p: { productId: string; quantity: number }) =>
        cartApi.addItem(p.productId, p.quantity).then(r => r.data.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
    removeItem: useMutation({
      mutationFn: (productId: string) =>
        cartApi.removeItem(productId).then(r => r.data.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
    applyCoupon: useMutation({
      mutationFn: (code: string) =>
        cartApi.applyCoupon(code).then(r => r.data.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
  };
}
