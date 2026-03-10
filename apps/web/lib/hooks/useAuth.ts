import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getCurrentUser().then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (p: { email: string; password: string; }) =>
      authApi.login(p.email, p.password),
    onSuccess: (response) => {
      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
        setUser(response.data.user);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) => authApi.register(data).then(r => r.data),
  });
}
