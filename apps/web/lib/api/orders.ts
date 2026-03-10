import { apiGet, apiPost } from './client';
import { Order } from '@/types/order';
import { PaginatedData } from '@/types/api';

export const ordersApi = {
  getMyOrders: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiGet<{ data: PaginatedData<Order> }>(`/orders/my${query}`);
  },
  getOrder: (id: string) =>
    apiGet<{ data: Order }>(`/orders/my/${id}`),
  createOrder: (data: any) =>
    apiPost<{ data: Order }>('/orders', data),
  cancelOrder: (id: string) =>
    apiPost<{ data: { message: string } }>(`/orders/${id}/cancel`),
};
