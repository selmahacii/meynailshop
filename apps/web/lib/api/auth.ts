import { apiPost, apiGet } from './client';
import { User, AuthResponse } from '@/types/user';

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<AuthResponse>('/auth/login', { email, password }),
  register: (data: any) =>
    apiPost<User>('/auth/register', data),
  getCurrentUser: () =>
    apiGet<User>('/auth/me'),
  refresh: (refreshToken: string) =>
    apiPost<{ accessToken: string }>('/auth/refresh', { refreshToken }),
};
