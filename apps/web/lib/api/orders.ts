import apiClient from './client';
import { Order } from '@/types/order';
import { PaginatedData } from '@/types/api';

export const ordersApi = {
  getMyOrders: (params?: any) =>
    apiClient.get<any, { data: PaginatedData<Order> }>('/orders/my', { params }),
  getOrder: (id: string) =>
    apiClient.get<any, { data: Order }>(`/orders/my/${id}`),
  createOrder: (data: any) =>
    apiClient.post<any, { data: Order }>('/orders', data),
  cancelOrder: (id: string) =>
    apiClient.post<any, { data: { message: string } }>(`/orders/${id}/cancel`),
};
