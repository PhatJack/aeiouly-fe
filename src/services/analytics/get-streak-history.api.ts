import { apiClient } from '@/lib/client';
import { StreakHistoryResponse } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getStreakHistoryApi(days: number = 30) {
  const response = await apiClient.get<StreakHistoryResponse>('/analytics/streak/history', {
    days,
  });
  return response.data;
}

export const useGetStreakHistoryQuery = (
  days: number = 30,
  options?: Omit<
    UseQueryOptions<StreakHistoryResponse, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<StreakHistoryResponse, ErrorResponseSchema>({
    queryKey: ['streakHistory', days],
    queryFn: () => getStreakHistoryApi(days),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
