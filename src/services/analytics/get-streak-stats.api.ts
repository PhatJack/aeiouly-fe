import { apiClient } from '@/lib/client';
import { StreakStatsResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakStatsApi() {
  const response = await apiClient.get<StreakStatsResponse>('/analytics/streak/stats');
  return response.data;
}

export const useGetStreakStatsQuery = (
  options?: Omit<UseQueryOptions<StreakStatsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<StreakStatsResponse, Error>({
    queryKey: ['streakStats'],
    queryFn: getStreakStatsApi,
    ...options,
  });
};
