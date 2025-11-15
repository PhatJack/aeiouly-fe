import { apiClient } from '@/lib/client';
import { YearlyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getYearlyStatsApi(year: number) {
  const response = await apiClient.get<YearlyLearningStats>('/analytics/learning/yearly', {
    year,
  });
  return response.data;
}

export const useGetYearlyStatsQuery = (
  year: number,
  options?: Omit<UseQueryOptions<YearlyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<YearlyLearningStats, ErrorResponseSchema>({
    queryKey: ['yearlyStats', year],
    queryFn: () => getYearlyStatsApi(year),
    enabled: !!year,
    ...options,
  });
};
