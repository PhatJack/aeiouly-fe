import { apiClient } from '@/lib/client';
import { LearningStatsResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getLearningStatsApi() {
  const response = await apiClient.get<LearningStatsResponse>('/analytics/learning/stats');
  return response.data;
}

export const useGetLearningStatsQuery = (
  options?: Omit<UseQueryOptions<LearningStatsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LearningStatsResponse, Error>({
    queryKey: ['learningStats'],
    queryFn: getLearningStatsApi,
    ...options,
  });
};
