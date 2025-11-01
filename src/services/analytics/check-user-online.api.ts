import { apiClient } from '@/lib/client';
import { UserOnlineStatusResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function checkUserOnlineApi(userId: number) {
  const response = await apiClient.get<UserOnlineStatusResponse>(
    `/analytics/online/check/${userId}`
  );
  return response.data;
}

export const useCheckUserOnlineQuery = (
  userId: number,
  options?: Omit<UseQueryOptions<UserOnlineStatusResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<UserOnlineStatusResponse, Error>({
    queryKey: ['userOnlineStatus', userId],
    queryFn: () => checkUserOnlineApi(userId),
    enabled: !!userId,
    ...options,
  });
};
