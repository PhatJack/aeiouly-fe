import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  SessionGoalResponseSchema,
  SessionGoalUpdateSchema,
} from '@/lib/schema/session-goal.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateSessionGoalApi(goalId: number, body: SessionGoalUpdateSchema) {
  const response = await apiClient.put<SessionGoalResponseSchema, SessionGoalUpdateSchema>(
    `/session-goals/${goalId}`,
    body
  );
  return response.data;
}

export const useUpdateSessionGoalMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    SessionGoalResponseSchema,
    ErrorResponseSchema,
    { goalId: number; data: SessionGoalUpdateSchema }
  >({
    mutationKey: ['updateSessionGoal'],
    mutationFn: ({ goalId, data }) => updateSessionGoalApi(goalId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session-goal', data.id] });
      queryClient.invalidateQueries({ queryKey: ['session-goals'] });
    },
  });
};
