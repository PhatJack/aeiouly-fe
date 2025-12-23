import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { createListResponseSchema } from '@/lib/schema/pagination';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { userResponseSchema } from '@/lib/schema/user.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { z } from 'zod';

const leaderboardItemSchema = z.object({
  user: userResponseSchema,
  current_streak: z.number(),
  longest_streak: z.number(),
});

const leaderboardListSchema = z.object({
  leaderboard: leaderboardItemSchema.array(),
  limit: z.number(),
});

export type LeaderboardResponse = z.infer<typeof leaderboardItemSchema>;
export type LeaderboardListResponse = z.infer<typeof leaderboardListSchema>;

export const getOnlineStreakLeaderboardApi = async (params?: PaginationRequestSchema) => {
  const response = await apiClient.get<LeaderboardListResponse>(
    `/online/streak/leaderboard`,
    params
  );
  return response.data;
};

export const useGetOnlineStreakLeaderboardQuery = (
  params?: PaginationRequestSchema,
  options?: Omit<
    UseQueryOptions<LeaderboardListResponse, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LeaderboardListResponse, ErrorResponseSchema>({
    queryKey: ['streak', 'leaderboard', params],
    queryFn: () => getOnlineStreakLeaderboardApi(params),
    staleTime: 25 * 60 * 1000, // 25 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
