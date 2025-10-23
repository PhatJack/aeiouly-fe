import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { WritingSessionResponseSchema } from '@/lib/schema/writing-session.schema';
import { QueryOptions, UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getWritingSessionApi(sessionId: number) {
  const response = await apiClient.get<WritingSessionResponseSchema>(
    `/writing-sessions/${sessionId}`
  );
  return response.data;
}

export const useGetWritingSessionQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<WritingSessionResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<WritingSessionResponseSchema, ErrorResponseSchema>({
    queryKey: ['writingSession', sessionId],
    queryFn: () => getWritingSessionApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
