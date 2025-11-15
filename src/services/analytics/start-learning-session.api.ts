import { apiClient } from '@/lib/client';
import { StartLearningSessionResponse } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function startLearningSessionApi() {
  const response = await apiClient.post<StartLearningSessionResponse>(
    '/analytics/learning/start',
    {}
  );
  return response.data;
}

export const useStartLearningSessionMutation = (
  options?: Omit<
    UseMutationOptions<StartLearningSessionResponse, ErrorResponseSchema>,
    'mutationFn'
  >
) => {
  return useMutation<StartLearningSessionResponse, ErrorResponseSchema>({
    mutationFn: startLearningSessionApi,
    ...options,
  });
};
