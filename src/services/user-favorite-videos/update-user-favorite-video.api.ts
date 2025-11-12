import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  UserFavoriteVideoResponseSchema,
  UserFavoriteVideoUpdateSchema,
} from '@/lib/schema/user-favorite-video.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateUserFavoriteVideoApi(
  videoId: number,
  body: UserFavoriteVideoUpdateSchema
) {
  const response = await apiClient.put<
    UserFavoriteVideoResponseSchema,
    UserFavoriteVideoUpdateSchema
  >(`/user-favorite-videos/${videoId}`, body);
  return response.data;
}

export const useUpdateUserFavoriteVideoMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    UserFavoriteVideoResponseSchema,
    ErrorResponseSchema,
    { videoId: number; body: UserFavoriteVideoUpdateSchema }
  >({
    mutationKey: ['updateUserFavoriteVideo'],
    mutationFn: ({ videoId, body }) => updateUserFavoriteVideoApi(videoId, body),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['userFavoriteVideo', videoId] });
      queryClient.invalidateQueries({ queryKey: ['userFavoriteVideos'] });
    },
  });
};
