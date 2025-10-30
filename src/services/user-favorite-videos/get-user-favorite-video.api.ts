import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserFavoriteVideoResponseSchema } from '@/lib/schema/user-favorite-video.schema';
import { useQuery } from '@tanstack/react-query';

export async function getUserFavoriteVideoApi(videoId: number) {
  const response = await apiClient.get<UserFavoriteVideoResponseSchema>(
    `/user-favorite-videos/${videoId}`
  );
  return response.data;
}

export const useGetUserFavoriteVideoQuery = (videoId: number) => {
  return useQuery<UserFavoriteVideoResponseSchema, ErrorResponseSchema>({
    queryKey: ['userFavoriteVideo', videoId],
    queryFn: () => getUserFavoriteVideoApi(videoId),
    refetchOnWindowFocus: false,
  });
};
