import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';

export function useMyOrders(params?: any) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getMyOrders(params).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ordersApi.createOrder(data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}
