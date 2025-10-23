import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { ReadingSessionDetailSchema } from '@/lib/schema/reading-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getReadingSessionDetailApi(sessionId: number) {
  const response = await apiClient.get<ReadingSessionDetailSchema>(
    `/reading-sessions/${sessionId}`
  );
  return response.data;
}

export const useGetReadingSessionDetailQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<ReadingSessionDetailSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<ReadingSessionDetailSchema, ErrorResponseSchema>({
    queryKey: ['readingSessionDetail', sessionId],
    queryFn: () => getReadingSessionDetailApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
