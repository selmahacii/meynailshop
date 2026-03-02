'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addressSchema } from '@/lib/utils/validation';
import { WILAYAS } from '@/lib/constants/wilayas';

interface CheckoutFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function CheckoutForm({ onSubmit, loading = false }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'ccp' | 'baridimob'>('cash_on_delivery');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      street: '',
      wilaya: '',
      commune: '',
      zipCode: '',
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, paymentMethod }))} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('firstName')}
          label="Prénom"
          placeholder="Jean"
          error={errors.firstName?.message}
        />
        <Input
          {...register('lastName')}
          label="Nom"
          placeholder="Dupont"
          error={errors.lastName?.message}
        />
      </div>

      <Input
        {...register('email')}
        type="email"
        label="Email"
        placeholder="jean@example.com"
        error={errors.email?.message}
      />

      <Input
        {...register('phone')}
        label="Téléphone"
        placeholder="+213612345678"
        error={errors.phone?.message}
      />

      <Input
        {...register('street')}
        label="Adresse"
        placeholder="123 rue de la Paix"
        error={errors.street?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-outfit font-medium text-encre mb-2">
            Wilaya
          </label>
          <select
            {...register('wilaya')}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-creme2 focus:border-rouge"
          >
            <option value="">Sélectionner une wilaya</option>
            {WILAYAS.map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
        </div>

        <Input
          {...register('commune')}
          label="Commune"
          placeholder="Alger Centre"
          error={errors.commune?.message}
        />
      </div>

      <Input
        {...register('zipCode')}
        label="Code postal"
        placeholder="16000"
        error={errors.zipCode?.message}
      />

      <div>
        <label className="block text-sm font-outfit font-medium text-encre mb-3">
          Méthode de paiement
        </label>
        <div className="space-y-2">
          {(
            [
              { value: 'cash_on_delivery', label: 'Paiement à la livraison (Cash)' },
              { value: 'ccp', label: 'Chèques Postaux CCP' },
              { value: 'baridimob', label: 'BaridiMob' },
            ] as const
          ).map((method) => (
            <label key={method.value} className="flex items-center gap-3 p-3 border border-creme2 rounded cursor-pointer hover:border-or">
              <input
                type="radio"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="w-4 h-4 accent-rouge"
              />
              <span className="font-outfit">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
      >
        Procéder au paiement
      </Button>
    </form>
  );
}
