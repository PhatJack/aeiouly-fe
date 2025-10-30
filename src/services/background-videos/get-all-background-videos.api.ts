import { apiClient } from '@/lib/client';
import { BackgroundVideoListResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getAllBackgroundVideosApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<BackgroundVideoListResponseSchema>(
    '/background-videos/',
    params
  );
  return response.data;
}

export const useGetAllBackgroundVideosQuery = (params?: PaginationRequestSchema) => {
  return useQuery<BackgroundVideoListResponseSchema, ErrorResponseSchema>({
    queryKey: ['background-videos', params],
    queryFn: () => getAllBackgroundVideosApi(params),
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 60 minutes
  });
};
