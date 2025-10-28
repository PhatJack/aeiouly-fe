import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  SessionGoalCreateSchema,
  SessionGoalResponseSchema,
} from '@/lib/schema/session-goal.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function createSessionGoalApi(body: SessionGoalCreateSchema) {
  const response = await apiClient.post<SessionGoalResponseSchema, SessionGoalCreateSchema>(
    '/session-goals/',
    body
  );
  return response.data;
}

export const useCreateSessionGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SessionGoalResponseSchema, ErrorResponseSchema, SessionGoalCreateSchema>({
    mutationKey: ['createSessionGoal'],
    mutationFn: (body) => createSessionGoalApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-goals'] });
    },
  });
};
