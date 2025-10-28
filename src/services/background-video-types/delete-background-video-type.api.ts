import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteBackgroundVideoTypeApi(typeId: number) {
  const response = await apiClient.delete<{ message: string }>(`/background-video-types/${typeId}`);
  return response.data;
}

export const useDeleteBackgroundVideoTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteBackgroundVideoType'],
    mutationFn: (typeId) => deleteBackgroundVideoTypeApi(typeId),
    onSuccess: (_, typeId) => {
      queryClient.removeQueries({ queryKey: ['background-video-type', typeId] });
      queryClient.invalidateQueries({ queryKey: ['background-video-types'] });
    },
  });
};
