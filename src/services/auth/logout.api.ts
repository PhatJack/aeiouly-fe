import { apiClient } from '@/lib/client';
import { BaseResponseNull } from '@/lib/schema/base-response';
import { useMutation } from '@tanstack/react-query';

export const logoutApi = async () => {
  const response = await apiClient.post<BaseResponseNull>('/auth/logout', {});
  return response.data;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: () => logoutApi(),
  });
};
