import { apiClient } from '@/lib/client';
import { BaseResponseNull } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export const deleteAccountApi = async () => {
  const response = await apiClient.delete<BaseResponseNull>('/auth/account');
  return response.data;
};

export const useDeleteAccountMutation = () => {
  return useMutation<BaseResponseNull, ErrorResponseSchema, void>({
    mutationKey: ['delete-account'],
    mutationFn: () => deleteAccountApi(),
  });
};
