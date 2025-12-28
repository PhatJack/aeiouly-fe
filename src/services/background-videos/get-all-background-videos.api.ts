import { apiClient } from '@/lib/client';
import { BackgroundVideoListResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getAllBackgroundVideosApi(
  params?: PaginationRequestSchema & {
    type_id?: number;
  }
) {
  const response = await apiClient.get<BackgroundVideoListResponseSchema>(
    '/background-videos/',
    params
  );
  return response.data;
}

export const useGetAllBackgroundVideosQuery = (
  params?: PaginationRequestSchema & {
    type_id?: number;
  }
) => {
  return useQuery<BackgroundVideoListResponseSchema, ErrorResponseSchema>({
    queryKey: ['background-videos', params],
    queryFn: () => getAllBackgroundVideosApi(params),
    refetchOnWindowFocus: false,
    meta: {
      ignoreGlobal: true,
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};
