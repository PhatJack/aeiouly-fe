import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { SoundListResponseSchema } from '@/lib/schema/sound.schema';
import { useQuery } from '@tanstack/react-query';

export async function getAllSoundsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<SoundListResponseSchema>('/sounds/', params);
  return response.data;
}

export const useGetAllSoundsQuery = (params?: PaginationRequestSchema) => {
  return useQuery<SoundListResponseSchema, ErrorResponseSchema>({
    queryKey: ['sounds', params],
    queryFn: () => getAllSoundsApi(params),
    refetchOnWindowFocus: false,
  });
};
