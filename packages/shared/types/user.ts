import { UserRole } from './api';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse extends Omit<User, 'password'> {}

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

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface CreateAddressDto {
  label: string;
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
