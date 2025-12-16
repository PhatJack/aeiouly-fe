import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

type WeeklyStreakDay = {
  date: string;
  has_streak: boolean;
};

type WeeklyStreakResponse = {
  current_streak: number;
  today_has_streak: boolean;
  days: WeeklyStreakDay[];
};

export const getWeeklyStreakStatusApi = async () => {
  const response = await apiClient.get<WeeklyStreakResponse>(`/online/streak/weekly`);
  return response.data;
};

export const useGetWeeklyStreakStatusQuery = (
  options?: Omit<UseQueryOptions<WeeklyStreakResponse, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<WeeklyStreakResponse, ErrorResponseSchema>({
    queryKey: ['analytics', 'streak', 'weekly'],
    queryFn: () => getWeeklyStreakStatusApi(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    ...options,
  });
};
