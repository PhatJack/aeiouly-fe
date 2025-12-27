import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { DeleteResponseSchema } from '@/lib/schema/learning-path.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteMyLearningPathApi(): Promise<DeleteResponseSchema> {
  const response = await apiClient.delete<DeleteResponseSchema>('/learning-paths/me');
  return response.data;
}

export const useDeleteMyLearningPathMutation = (
  options?: Omit<
    UseMutationOptions<DeleteResponseSchema, ErrorResponseSchema, void>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<DeleteResponseSchema, ErrorResponseSchema, void>({
    mutationKey: ['deleteMyLearningPath'],
    mutationFn: () => deleteMyLearningPathApi(),
    ...options,
  });
};
