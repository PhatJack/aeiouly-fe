import { apiClient } from '@/lib/client';
import { BackgroundVideoResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getBackgroundVideoApi(videoId: number) {
  const response = await apiClient.get<BackgroundVideoResponseSchema>(
    `/background-videos/${videoId}`
  );
  return response.data;
}

export const useGetBackgroundVideoQuery = (videoId: number) => {
  return useQuery<BackgroundVideoResponseSchema, ErrorResponseSchema>({
    queryKey: ['background-video', videoId],
    queryFn: () => getBackgroundVideoApi(videoId),
    refetchOnWindowFocus: false,
    enabled: !!videoId,
  });
};
