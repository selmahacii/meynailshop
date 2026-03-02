import apiClient from './client';
import { User, AuthResponse } from '@/types/user';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<any, { data: AuthResponse }>('/auth/login', { email, password }),
  register: (data: any) =>
    apiClient.post<any, { data: User }>('/auth/register', data),
  getCurrentUser: () =>
    apiClient.get<any, { data: User }>('/auth/me'),
  refresh: (refreshToken: string) =>
    apiClient.post<any, { data: { accessToken: string } }>('/auth/refresh', { refreshToken }),
};
