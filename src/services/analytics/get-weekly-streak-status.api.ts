import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

type WeeklyStreakDay = {
  date: string;
  logged_in: boolean;
};

export const getWeeklyStreakStatusApi = async () => {
  const response = await apiClient.get<WeeklyStreakDay[]>(`/online/streak/weekly`);
  return response.data;
};

export const useGetWeeklyStreakStatusQuery = (
  options?: Omit<UseQueryOptions<WeeklyStreakDay[], ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyStreakDay[], ErrorResponseSchema>({
    queryKey: ['analytics', 'streak', 'weekly'],
    queryFn: () => getWeeklyStreakStatusApi(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    ...options,
  });
};
