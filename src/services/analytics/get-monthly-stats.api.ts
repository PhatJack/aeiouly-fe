import { apiClient } from '@/lib/client';
import { MonthlyLearningStats } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getMonthlyStatsApi(year: number, month: number) {
  const response = await apiClient.get<MonthlyLearningStats>('/analytics/learning/monthly', {
    params: { year, month },
  });
  return response.data;
}

export const useGetMonthlyStatsQuery = (
  year: number,
  month: number,
  options?: Omit<UseQueryOptions<MonthlyLearningStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MonthlyLearningStats, Error>({
    queryKey: ['monthlyStats', year, month],
    queryFn: () => getMonthlyStatsApi(year, month),
    enabled: !!year && !!month,
    ...options,
  });
};
