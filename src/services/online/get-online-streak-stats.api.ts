import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

type OnlineStreakStats = {
  user_id: number;
  current_streak: number;
  longest_streak: number;
  level: 'newbie' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'legend';
  next_milestone: number | null;
  remaining_to_next_milestone: number;
};

export const geOnlineStreakStatsApi = async () => {
  const response = await apiClient.get<OnlineStreakStats>(`/online/streak/stats`);
  return response.data;
};

export const useGetOnlineStreakStatsQuery = (
  options?: Omit<UseQueryOptions<OnlineStreakStats, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<OnlineStreakStats, ErrorResponseSchema>({
    queryKey: ['streak', 'online-stats'],
    queryFn: () => geOnlineStreakStatsApi(),
    meta: {
      ignoreGlobal: true,
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    ...options,
  });
};
