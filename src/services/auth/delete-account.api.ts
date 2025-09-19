import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

import { z } from 'zod';

export const deleteAccountResponseSchema = z.object({
  message: z.string(),
});

export type DeleteAccountResponseSchema = z.infer<typeof deleteAccountResponseSchema>;

export const deleteAccountApi = async () => {
  const response = await apiClient.delete<DeleteAccountResponseSchema>('/auth/delete-account');
  return response.data;
};

export const useDeleteAccountMutation = () => {
  return useMutation<DeleteAccountResponseSchema, ErrorResponseSchema, void>({
    mutationKey: ['delete-account'],
    mutationFn: () => deleteAccountApi(),
  });
};
