import { apiClient } from '@/lib/client';
import { YearlyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getCurrentYearStatsApi() {
  const response = await apiClient.get<YearlyLearningStats>('/analytics/learning/yearly/current');
  return response.data;
}

export const useGetCurrentYearStatsQuery = (
  options?: Omit<UseQueryOptions<YearlyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<YearlyLearningStats, ErrorResponseSchema>({
    queryKey: ['currentYearStats'],
    queryFn: getCurrentYearStatsApi,
    ...options,
  });
};
