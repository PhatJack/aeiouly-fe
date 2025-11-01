import { apiClient } from '@/lib/client';
import { DailyLearningStats } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getDailyStatsApi(targetDate: string) {
  const response = await apiClient.get<DailyLearningStats>('/analytics/learning/daily', {
    params: { target_date: targetDate },
  });
  return response.data;
}

export const useGetDailyStatsQuery = (
  targetDate: string,
  options?: Omit<UseQueryOptions<DailyLearningStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<DailyLearningStats, Error>({
    queryKey: ['dailyStats', targetDate],
    queryFn: () => getDailyStatsApi(targetDate),
    enabled: !!targetDate,
    ...options,
  });
};
