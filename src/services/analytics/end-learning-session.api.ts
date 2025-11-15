import { apiClient } from '@/lib/client';
import { EndLearningSessionResponse } from '@/lib/schema/analytics.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function endLearningSessionApi() {
  const response = await apiClient.post<EndLearningSessionResponse>('/analytics/learning/end', {});
  return response.data;
}

export const useEndLearningSessionMutation = (
  options?: Omit<UseMutationOptions<EndLearningSessionResponse, ErrorResponseSchema>, 'mutationFn'>
) => {
  return useMutation<EndLearningSessionResponse, ErrorResponseSchema>({
    mutationFn: endLearningSessionApi,
    ...options,
  });
};
