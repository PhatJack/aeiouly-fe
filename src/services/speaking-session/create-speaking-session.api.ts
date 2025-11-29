import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  SpeakingSessionCreateSchema,
  SpeakingSessionResponseSchema,
} from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createSpeakingSessionApi(body: SpeakingSessionCreateSchema) {
  const response = await apiClient.post<SpeakingSessionResponseSchema, SpeakingSessionCreateSchema>(
    '/speaking-sessions/',
    body
  );
  return response.data;
}

export const useCreateSpeakingSessionMutation = (
  options?: Omit<
    UseMutationOptions<
      SpeakingSessionResponseSchema,
      ErrorResponseSchema,
      SpeakingSessionCreateSchema
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  const queryClient = getQueryClient();
  return useMutation<
    SpeakingSessionResponseSchema,
    ErrorResponseSchema,
    SpeakingSessionCreateSchema
  >({
    mutationKey: ['createSpeakingSession'],
    mutationFn: (body) => createSpeakingSessionApi(body),
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: ['speakingSessions'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, items: [data, ...oldData.items] };
      });
    },
    ...options,
  });
};
