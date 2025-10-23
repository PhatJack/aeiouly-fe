import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getListeningSessionApi(sessionId: number) {
  const response = await apiClient.get<SessionDetailResponseSchema>(
    `/listening-sessions/${sessionId}`
  );
  return response.data;
}

export const useGetListeningSessionQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<SessionDetailResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SessionDetailResponseSchema, ErrorResponseSchema>({
    queryKey: ['listeningSession', sessionId],
    queryFn: () => getListeningSessionApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
