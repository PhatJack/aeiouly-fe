import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { SessionGoalListResponseSchema } from '@/lib/schema/session-goal.schema';
import { useQuery } from '@tanstack/react-query';

interface GetSessionGoalsParams extends PaginationRequestSchema {
  status?: 'OPEN' | 'COMPLETED';
}

export async function getAllSessionGoalsApi(params?: GetSessionGoalsParams) {
  const response = await apiClient.get<SessionGoalListResponseSchema>('/session-goals/', params);
  return response.data;
}

export const useGetAllSessionGoalsQuery = (params?: GetSessionGoalsParams) => {
  return useQuery<SessionGoalListResponseSchema, ErrorResponseSchema>({
    queryKey: ['session-goals', params],
    queryFn: () => getAllSessionGoalsApi(params),
    refetchOnWindowFocus: false,
  });
};
