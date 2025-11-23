import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { SpeakingSessionListResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getSpeakingSessionsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<SpeakingSessionListResponseSchema>(
    '/speaking-sessions/',
    params
  );
  return response.data;
}

export const useGetSpeakingSessionsQuery = (
  params?: PaginationRequestSchema,
  options?: Omit<
    UseQueryOptions<SpeakingSessionListResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SpeakingSessionListResponseSchema, ErrorResponseSchema>({
    queryKey: ['speakingSessions', params],
    queryFn: () => getSpeakingSessionsApi(params),
    refetchOnWindowFocus: false,
    ...options,
  });
};
