'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WILAYAS } from '@/lib/constants/wilayas';
import { addressSchema } from '@/lib/utils/validation';
import { toast } from 'sonner';
import { useState } from 'react';

type AddressFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  commune: string;
  wilaya: string;
  zipCode: string;
};

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success('Adresse enregistrée avec succès');
      reset();
      onCancel?.();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('firstName')}
          label="Prénom"
          error={errors.firstName?.message}
          disabled={loading}
        />
        <Input
          {...register('lastName')}
          label="Nom"
          error={errors.lastName?.message}
          disabled={loading}
        />
      </div>

      <Input
        {...register('phone')}
        label="Téléphone"
        placeholder="+213612345678"
        error={errors.phone?.message}
        disabled={loading}
      />

      <Input
        {...register('street')}
        label="Rue"
        placeholder="123 rue de la Paix"
        error={errors.street?.message}
        disabled={loading}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-outfit font-medium text-encre mb-2">
            Wilaya
          </label>
          <select
            {...register('wilaya')}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-creme2 focus:border-rouge focus:ring-1 focus:ring-rouge disabled:bg-creme2"
            disabled={loading}
          >
            <option value="">Sélectionner</option>
            {WILAYAS.map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
          {errors.wilaya && (
            <p className="text-sm text-red-600 mt-1">{errors.wilaya.message}</p>
          )}
        </div>

        <Input
          {...register('commune')}
          label="Commune"
          error={errors.commune?.message}
          disabled={loading}
        />
      </div>

      <Input
        {...register('zipCode')}
        label="Code postal"
        error={errors.zipCode?.message}
        disabled={loading}
      />

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
