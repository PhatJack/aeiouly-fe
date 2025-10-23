import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { WritingSessionListResponseSchema } from '@/lib/schema/writing-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getWritingSessionsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<WritingSessionListResponseSchema>(
    '/writing-sessions/',
    params
  );
  return response.data;
}

export const useGetWritingSessionsQuery = (
  params?: PaginationRequestSchema,
  options?: Omit<
    UseQueryOptions<WritingSessionListResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<WritingSessionListResponseSchema, ErrorResponseSchema>({
    queryKey: ['writingSessions', params],
    queryFn: () => getWritingSessionsApi(params),
    refetchOnWindowFocus: false,
    ...options,
  });
};
