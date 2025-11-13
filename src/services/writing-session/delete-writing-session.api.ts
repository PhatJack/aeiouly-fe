import { getQueryClient } from '@/app/get-query-client';
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
  const queryClient = getQueryClient();
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteWritingSession'],
    mutationFn: (sessionId) => deleteWritingSessionApi(sessionId),
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: ['writingSessions'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.filter((item: any) => item.id !== variables),
        };
      });
    },
    ...options,
  });
};
