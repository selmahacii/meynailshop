export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
