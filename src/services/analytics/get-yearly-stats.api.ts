import { apiClient } from '@/lib/client';
import { YearlyLearningStats } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getYearlyStatsApi(year: number) {
  const response = await apiClient.get<YearlyLearningStats>('/analytics/learning/yearly', {
    params: { year },
  });
  return response.data;
}

export const useGetYearlyStatsQuery = (
  year: number,
  options?: Omit<UseQueryOptions<YearlyLearningStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<YearlyLearningStats, Error>({
    queryKey: ['yearlyStats', year],
    queryFn: () => getYearlyStatsApi(year),
    enabled: !!year,
    ...options,
  });
};
