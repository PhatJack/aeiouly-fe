import { apiClient } from '@/lib/client';
import { StreakHistoryResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakHistoryApi(days: number = 30) {
  const response = await apiClient.get<StreakHistoryResponse>('/analytics/streak/history', {
    params: { days },
  });
  return response.data;
}

export const useGetStreakHistoryQuery = (
  days: number = 30,
  options?: Omit<UseQueryOptions<StreakHistoryResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<StreakHistoryResponse, Error>({
    queryKey: ['streakHistory', days],
    queryFn: () => getStreakHistoryApi(days),
    ...options,
  });
};
