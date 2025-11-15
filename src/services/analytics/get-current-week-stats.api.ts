import { apiClient } from '@/lib/client';
import { WeeklyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getCurrentWeekStatsApi() {
  const response = await apiClient.get<WeeklyLearningStats>('/analytics/learning/weekly/current');
  return response.data;
}

export const useGetCurrentWeekStatsQuery = (
  options?: Omit<UseQueryOptions<WeeklyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyLearningStats, ErrorResponseSchema>({
    queryKey: ['currentWeekStats'],
    queryFn: getCurrentWeekStatsApi,
    ...options,
  });
};
