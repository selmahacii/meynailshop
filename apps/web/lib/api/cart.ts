import apiClient from './client';
import { CartResponse } from '@/types/cart';

export const cartApi = {
  getCart: () =>
    apiClient.get<any, { data: CartResponse }>('/cart'),
  addItem: (productId: string, quantity: number) =>
    apiClient.post<any, { data: CartResponse }>('/cart/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    apiClient.patch<any, { data: CartResponse }>(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) =>
    apiClient.delete<any, { data: CartResponse }>(`/cart/items/${productId}`),
  applyCoupon: (code: string) =>
    apiClient.post<any, { data: CartResponse }>('/cart/coupon', { code }),
  removeCoupon: () =>
    apiClient.delete<any, { data: CartResponse }>('/cart/coupon'),
  clear: () =>
    apiClient.delete<any, { data: { message: string } }>('/cart'),
};
