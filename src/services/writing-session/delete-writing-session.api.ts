import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteWritingSessionApi(sessionId: number): Promise<void> {
  await apiClient.delete(`/writing-sessions/${sessionId}`);
}

export const useDeleteWritingSessionMutation = (
  options?: Omit<
    UseMutationOptions<void, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteWritingSession'],
    mutationFn: (sessionId) => deleteWritingSessionApi(sessionId),
    ...options,
  });
};
