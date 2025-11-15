import { apiClient } from '@/lib/client';
import { MonthlyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getCurrentMonthStatsApi() {
  const response = await apiClient.get<MonthlyLearningStats>('/analytics/learning/monthly/current');
  return response.data;
}

export const useGetCurrentMonthStatsQuery = (
  options?: Omit<UseQueryOptions<MonthlyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MonthlyLearningStats, ErrorResponseSchema>({
    queryKey: ['currentMonthStats'],
    queryFn: getCurrentMonthStatsApi,
    ...options,
  });
};
