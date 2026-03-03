import { apiClient } from '@/lib/client';
import { BadgesListResponseSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getBadgesApi(
  params?: PaginationRequestSchema & {
    include_inactive?: boolean;
    badge_category_id?: number | null;
    query?: string;
  }
) {
  const response = await apiClient.get<BadgesListResponseSchema>('/badges/', params);
  return response.data;
}

export const useGetBadgesQuery = (
  params?: PaginationRequestSchema & {
    include_inactive?: boolean;
    badge_category_id?: number | null;
    query?: string;
  }
) => {
  return useQuery<BadgesListResponseSchema, ErrorResponseSchema>({
    queryKey: ['badges', params],
    queryFn: () => getBadgesApi(params),
    refetchOnWindowFocus: false,
    meta: { ignoreGlobal: true },
  });
};
