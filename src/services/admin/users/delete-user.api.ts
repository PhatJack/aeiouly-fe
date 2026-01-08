import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function deleteUserApi(userId: number) {
  const response = await apiClient.delete<{ message: string }>(`/users/${userId}`);
  return response.data;
}

export const useDeleteUserMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteUser'],
    mutationFn: (userId) => deleteUserApi(userId),
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
