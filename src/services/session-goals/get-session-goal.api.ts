import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SessionGoalResponseSchema } from '@/lib/schema/session-goal.schema';
import { useQuery } from '@tanstack/react-query';

export async function getSessionGoalApi(goalId: number) {
  const response = await apiClient.get<SessionGoalResponseSchema>(`/session-goals/${goalId}`);
  return response.data;
}

export const useGetSessionGoalQuery = (goalId: number) => {
  return useQuery<SessionGoalResponseSchema, ErrorResponseSchema>({
    queryKey: ['session-goal', goalId],
    queryFn: () => getSessionGoalApi(goalId),
    refetchOnWindowFocus: false,
    enabled: !!goalId,
  });
};
