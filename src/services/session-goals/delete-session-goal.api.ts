import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function deleteSessionGoalApi(goalId: number) {
  const response = await apiClient.delete<{ message: string }>(`/session-goals/${goalId}`);
  return response.data;
}

export const useDeleteSessionGoalMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteSessionGoal'],
    mutationFn: (goalId) => deleteSessionGoalApi(goalId),
    onSuccess: (_, goalId) => {
      queryClient.removeQueries({ queryKey: ['session-goal', goalId] });
      queryClient.invalidateQueries({ queryKey: ['session-goals'] });
    },
  });
};
