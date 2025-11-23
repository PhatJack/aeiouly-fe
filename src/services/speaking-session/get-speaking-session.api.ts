import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SpeakingSessionResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getSpeakingSessionApi(sessionId: number) {
  const response = await apiClient.get<SpeakingSessionResponseSchema>(
    `/speaking-sessions/${sessionId}`
  );
  return response.data;
}

export const useGetSpeakingSessionQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<SpeakingSessionResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SpeakingSessionResponseSchema, ErrorResponseSchema>({
    queryKey: ['speakingSession', sessionId],
    queryFn: () => getSpeakingSessionApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
