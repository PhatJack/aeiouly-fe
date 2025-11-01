import { apiClient } from '@/lib/client';
import { StreakLeaderboardResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakLeaderboardApi(limit: number = 10) {
  const response = await apiClient.get<StreakLeaderboardResponse>('/analytics/streak/leaderboard', {
    params: { limit },
  });
  return response.data;
}

export const useGetStreakLeaderboardQuery = (
  limit: number = 10,
  options?: Omit<UseQueryOptions<StreakLeaderboardResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<StreakLeaderboardResponse, Error>({
    queryKey: ['streakLeaderboard', limit],
    queryFn: () => getStreakLeaderboardApi(limit),
    ...options,
  });
};
