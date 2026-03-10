import { apiGet, apiPost, apiPatch, apiDelete } from './client';
import { User, Address } from '@/types/user';

export const usersApi = {
  getProfile: () =>
    apiGet<{ data: User }>('/users/profile'),
  updateProfile: (data: any) =>
    apiPatch<{ data: User }>('/users/profile', data),
  getAddresses: () =>
    apiGet<{ data: Address[] }>('/users/profile/addresses'),
  addAddress: (data: any) =>
    apiPost<{ data: Address }>('/users/profile/addresses', data),
  removeAddress: (id: string) =>
    apiDelete<{ data: { message: string } }>(`/users/profile/addresses/${id}`),
};
