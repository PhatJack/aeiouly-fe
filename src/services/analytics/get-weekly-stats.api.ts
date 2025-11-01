import { apiClient } from '@/lib/client';
import { WeeklyLearningStats } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getWeeklyStatsApi(year: number, week: number) {
  const response = await apiClient.get<WeeklyLearningStats>('/analytics/learning/weekly', {
    params: { year, week },
  });
  return response.data;
}

export const useGetWeeklyStatsQuery = (
  year: number,
  week: number,
  options?: Omit<UseQueryOptions<WeeklyLearningStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyLearningStats, Error>({
    queryKey: ['weeklyStats', year, week],
    queryFn: () => getWeeklyStatsApi(year, week),
    enabled: !!year && !!week,
    ...options,
  });
};
