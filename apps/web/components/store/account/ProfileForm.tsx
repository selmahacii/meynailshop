'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { useState } from 'react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Au minimum 2 caractères'),
  lastName: z.string().min(2, 'Au minimum 2 caractères'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro invalide'),
  email: z.string().email('Email invalide'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success('Profil mis à jour avec succès');
      reset(data);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
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
        {...register('email')}
        type="email"
        label="Email"
        error={errors.email?.message}
        disabled={loading}
      />

      <Input
        {...register('phone')}
        label="Téléphone"
        placeholder="+213612345678"
        error={errors.phone?.message}
        disabled={loading}
      />

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Enregistrer les modifications
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={loading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
