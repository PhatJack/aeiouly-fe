import { apiClient } from '@/lib/client';
import { BackgroundVideoTypeListResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getAllBackgroundVideoTypesApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<BackgroundVideoTypeListResponseSchema>(
    '/background-video-types/',
    params
  );
  return response.data;
}

export const useGetAllBackgroundVideoTypesQuery = (params?: PaginationRequestSchema) => {
  return useQuery<BackgroundVideoTypeListResponseSchema, ErrorResponseSchema>({
    queryKey: ['background-video-types', params],
    queryFn: () => getAllBackgroundVideoTypesApi(params),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};
