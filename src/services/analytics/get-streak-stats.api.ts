import { apiClient } from '@/lib/client';
import { StreakStatsResponse } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakStatsApi() {
  const response = await apiClient.get<StreakStatsResponse>('/analytics/streak/stats');
  return response.data;
}

export const useGetStreakStatsQuery = (
  options?: Omit<UseQueryOptions<StreakStatsResponse, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<StreakStatsResponse, ErrorResponseSchema>({
    queryKey: ['streakStats'],
    queryFn: getStreakStatsApi,
    meta: {
      ignoreGlobal: true,
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    ...options,
  });
};
