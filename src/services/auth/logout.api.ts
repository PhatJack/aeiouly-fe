import { clearCookies } from '@/lib/auth-utils';
import { apiClient } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';

export const logoutApi = async () => {
  const response = await apiClient.post('/auth/logout', {});
  return response.data;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearCookies();
    },
    onError: () => {
      clearCookies();
    },
  });
};
