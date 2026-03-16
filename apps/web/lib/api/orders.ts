import { apiGet, apiPost } from './client';
import { Order } from '@/types/order';
import { PaginatedData } from '@/types/api';

export const ordersApi = {
  getMyOrders: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiGet<PaginatedData<Order>>(`/api/orders${query}`);
  },
  getOrder: (id: string) =>
    apiGet<Order>(`/api/orders/${id}`),
  createOrder: (data: any) =>
    apiPost<Order>('/api/orders', data),
  cancelOrder: (id: string) =>
    apiPost<{ message: string }>(`/api/orders/${id}/cancel`),
};
