import apiClient from './client';
import { User, Address } from '@/types/user';

export const usersApi = {
  getProfile: () =>
    apiClient.get<any, { data: User }>('/users/profile'),
  updateProfile: (data: any) =>
    apiClient.patch<any, { data: User }>('/users/profile', data),
  getAddresses: () =>
    apiClient.get<any, { data: Address[] }>('/users/profile/addresses'),
  addAddress: (data: any) =>
    apiClient.post<any, { data: Address }>('/users/profile/addresses', data),
  removeAddress: (id: string) =>
    apiClient.delete<any, { data: { message: string } }>(`/users/profile/addresses/${id}`),
};
