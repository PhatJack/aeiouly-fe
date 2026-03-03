import { apiClient } from '@/lib/client';
import { MyBadgesListResponseSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getMyBadgesApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<MyBadgesListResponseSchema>('/badges/me', params);
  return response.data;
}

export const useGetMyBadgesQuery = (params?: PaginationRequestSchema) => {
  return useQuery<MyBadgesListResponseSchema, ErrorResponseSchema>({
    queryKey: ['my-badges', params],
    queryFn: () => getMyBadgesApi(params),
    refetchOnWindowFocus: false,
    meta: { ignoreGlobal: true },
  });
};
