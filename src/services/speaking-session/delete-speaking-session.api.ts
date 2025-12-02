import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteSpeakingSessionApi(sessionId: number): Promise<void> {
  await apiClient.delete(`/speaking-sessions/${sessionId}`);
}

export const useDeleteSpeakingSessionMutation = (
  options?: Omit<
    UseMutationOptions<void, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  const queryClient = getQueryClient();
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteSpeakingSession'],
    mutationFn: (sessionId) => deleteSpeakingSessionApi(sessionId),
    meta: {
      ignoreGlobal: true,
    },
    onSuccess: (_, variables) => {
      console.log(variables);
      queryClient.setQueriesData({ queryKey: ['speakingSessions'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, items: oldData.items.filter((item: any) => item.id !== variables) };
      });
    },
    ...options,
  });
};
