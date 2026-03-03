import { apiClient } from '@/lib/client';
import { BadgeCategoriesListResponseSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { useQuery } from '@tanstack/react-query';

export async function getBadgeCategoriesApi(
  params?: PaginationRequestSchema & {
    include_inactive?: boolean;
  }
) {
  const response = await apiClient.get<BadgeCategoriesListResponseSchema>(
    '/badges/categories',
    params
  );
  return response.data;
}

export const useGetBadgeCategoriesQuery = (
  params?: PaginationRequestSchema & {
    include_inactive?: boolean;
  }
) => {
  return useQuery<BadgeCategoriesListResponseSchema, ErrorResponseSchema>({
    queryKey: ['badgeCategories', params],
    queryFn: () => getBadgeCategoriesApi(params),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    meta: { ignoreGlobal: true },
  });
};
