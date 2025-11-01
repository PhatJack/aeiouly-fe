import { apiClient } from '@/lib/client';
import { StartLearningSessionResponse } from '@/lib/schema/analytics.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function startLearningSessionApi() {
  const response = await apiClient.post<StartLearningSessionResponse>(
    '/analytics/learning/start',
    {}
  );
  return response.data;
}

export const useStartLearningSessionMutation = (
  options?: Omit<UseMutationOptions<StartLearningSessionResponse, Error>, 'mutationFn'>
) => {
  return useMutation<StartLearningSessionResponse, Error>({
    mutationFn: startLearningSessionApi,
    ...options,
  });
};
