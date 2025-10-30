import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteUserFavoriteVideoApi(videoId: number) {
  const response = await apiClient.delete<{ message: string }>(`/user-favorite-videos/${videoId}`);
  return response.data;
}

export const useDeleteUserFavoriteVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteUserFavoriteVideo'],
    mutationFn: (videoId) => deleteUserFavoriteVideoApi(videoId),
    onSuccess: (_, videoId) => {
      queryClient.removeQueries({ queryKey: ['userFavoriteVideo', videoId] });
      queryClient.invalidateQueries({ queryKey: ['userFavoriteVideos'] });
    },
  });
};
