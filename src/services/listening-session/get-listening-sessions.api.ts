import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SessionListResponseSchema } from '@/lib/schema/listening-session.schema';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getListeningSessionsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<SessionListResponseSchema>('/listening-sessions', params);
  return response.data;
}

export const useGetListeningSessionsQuery = (
  params?: PaginationRequestSchema,
  options?: Omit<
    UseQueryOptions<SessionListResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SessionListResponseSchema, ErrorResponseSchema>({
    queryKey: ['listeningSessions', params],
    queryFn: () => getListeningSessionsApi(params),
    refetchOnWindowFocus: false,
    ...options,
  });
};
