import { apiClient } from '@/lib/client';
import { StreakLeaderboardResponse } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakLeaderboardApi(limit: number = 10) {
  const response = await apiClient.get<StreakLeaderboardResponse>('/analytics/streak/leaderboard', {
    limit,
  });
  return response.data;
}

export const useGetStreakLeaderboardQuery = (
  limit: number = 10,
  options?: Omit<
    UseQueryOptions<StreakLeaderboardResponse, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<StreakLeaderboardResponse, ErrorResponseSchema>({
    queryKey: ['streakLeaderboard', limit],
    queryFn: () => getStreakLeaderboardApi(limit),
    ...options,
  });
};
