import { apiClient } from '@/lib/client';
import { CurrentUserOnlineStatusResponse } from '@/lib/schema/analytics.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function checkCurrentUserOnlineApi() {
  const response = await apiClient.get<CurrentUserOnlineStatusResponse>('/analytics/online/check');
  return response.data;
}

export const useCheckCurrentUserOnlineQuery = (
  options?: Omit<UseQueryOptions<CurrentUserOnlineStatusResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CurrentUserOnlineStatusResponse, Error>({
    queryKey: ['currentUserOnlineStatus'],
    queryFn: checkCurrentUserOnlineApi,
    ...options,
  });
};
