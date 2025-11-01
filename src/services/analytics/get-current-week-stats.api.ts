import { apiClient } from '@/lib/client';
import { WeeklyLearningStats } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getCurrentWeekStatsApi() {
  const response = await apiClient.get<WeeklyLearningStats>('/analytics/learning/weekly/current');
  return response.data;
}

export const useGetCurrentWeekStatsQuery = (
  options?: Omit<UseQueryOptions<WeeklyLearningStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyLearningStats, Error>({
    queryKey: ['currentWeekStats'],
    queryFn: getCurrentWeekStatsApi,
    ...options,
  });
};
