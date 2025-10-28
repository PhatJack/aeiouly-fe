import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteUserApi(userId: number) {
  const response = await apiClient.delete<{ message: string }>(`/users/${userId}`);
  return response.data;
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteUser'],
    mutationFn: (userId) => deleteUserApi(userId),
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
