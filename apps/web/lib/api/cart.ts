import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import { CartResponse } from '@/types/cart';

export const cartApi = {
  getCart: () =>
    apiGet<{ data: CartResponse }>('/cart'),
  addItem: (productId: string, quantity: number) =>
    apiPost<{ data: CartResponse }>('/cart/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    apiPatch<{ data: CartResponse }>(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) =>
    apiDelete<{ data: CartResponse }>(`/cart/items/${productId}`),
  applyCoupon: (code: string) =>
    apiPost<{ data: CartResponse }>('/cart/coupon', { code }),
  removeCoupon: () =>
    apiDelete<{ data: CartResponse }>('/cart/coupon'),
  clear: () =>
    apiDelete<{ data: { message: string } }>('/cart'),
};
