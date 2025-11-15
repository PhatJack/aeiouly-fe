import { apiClient } from '@/lib/client';
import { WeeklyLearningStats } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getWeeklyStatsApi(year: number, week: number) {
  const response = await apiClient.get<WeeklyLearningStats>('/analytics/learning/weekly', {
    year,
    week,
  });
  return response.data;
}

export const useGetWeeklyStatsQuery = (
  year: number,
  week: number,
  options?: Omit<UseQueryOptions<WeeklyLearningStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyLearningStats, ErrorResponseSchema>({
    queryKey: ['weeklyStats', year, week],
    queryFn: () => getWeeklyStatsApi(year, week),
    enabled: !!year && !!week,
    ...options,
  });
};
