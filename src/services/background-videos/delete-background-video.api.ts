import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteBackgroundVideoApi(videoId: number) {
  const response = await apiClient.delete<{ message: string }>(`/background-videos/${videoId}`);
  return response.data;
}

export const useDeleteBackgroundVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteBackgroundVideo'],
    mutationFn: (videoId) => deleteBackgroundVideoApi(videoId),
    onSuccess: (_, videoId) => {
      queryClient.removeQueries({ queryKey: ['background-video', videoId] });
      queryClient.invalidateQueries({ queryKey: ['background-videos'] });
    },
  });
};
