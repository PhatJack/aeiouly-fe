import { apiClient } from '@/lib/client';
import { BackgroundVideoTypeResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getBackgroundVideoTypeApi(typeId: number) {
  const response = await apiClient.get<BackgroundVideoTypeResponseSchema>(
    `/background-video-types/${typeId}`
  );
  return response.data;
}

export const useGetBackgroundVideoTypeQuery = (typeId: number) => {
  return useQuery<BackgroundVideoTypeResponseSchema, ErrorResponseSchema>({
    queryKey: ['background-video-type', typeId],
    queryFn: () => getBackgroundVideoTypeApi(typeId),
    refetchOnWindowFocus: false,
    enabled: !!typeId,
  });
};
