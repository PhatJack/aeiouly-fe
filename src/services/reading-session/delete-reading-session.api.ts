import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteReadingSessionApi(sessionId: number): Promise<void> {
  await apiClient.delete(`/reading-sessions/${sessionId}`);
}

export const useDeleteReadingSessionMutation = (
  options?: Omit<
    UseMutationOptions<void, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteReadingSession'],
    mutationFn: (sessionId) => deleteReadingSessionApi(sessionId),
    ...options,
  });
};
