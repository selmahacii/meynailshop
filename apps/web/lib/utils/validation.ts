import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Au minimum 6 caractères'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Au minimum 6 caractères'),
  firstName: z.string().min(2, 'Obligatoire'),
  lastName: z.string().min(2, 'Obligatoire'),
  phone: z.string().min(10, 'Numéro invalide'),
});

export const addressSchema = z.object({
  label: z.string().min(2),
  fullName: z.string().min(2),
  phone: z.string().min(10),
  wilaya: z.string().min(2),
  commune: z.string().min(2),
  address: z.string().min(5),
  postalCode: z.string().min(5),
  isDefault: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
