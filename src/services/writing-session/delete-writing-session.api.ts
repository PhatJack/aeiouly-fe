import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function deleteWritingSessionApi(sessionId: number): Promise<void> {
  await apiClient.delete(`/writing-sessions/${sessionId}`);
}

export const useDeleteWritingSessionMutation = () => {
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteWritingSession'],
    mutationFn: (sessionId) => deleteWritingSessionApi(sessionId),
  });
};
