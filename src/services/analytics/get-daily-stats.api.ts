import { apiClient } from '@/lib/client';
import { DailyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getDailyStatsApi(targetDate: string) {
  const response = await apiClient.get<DailyLearningStats>('/analytics/learning/daily', {
    target_date: targetDate,
  });
  return response.data;
}

export const useGetDailyStatsQuery = (
  targetDate: string,
  options?: Omit<UseQueryOptions<DailyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<DailyLearningStats, ErrorResponseSchema>({
    queryKey: ['dailyStats', targetDate],
    queryFn: () => getDailyStatsApi(targetDate),
    enabled: !!targetDate,
    ...options,
  });
};
