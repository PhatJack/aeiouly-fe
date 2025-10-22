import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { WritingSessionListResponseSchema } from '@/lib/schema/writing-session.schema';
import { useQuery } from '@tanstack/react-query';

export async function getWritingSessionsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<WritingSessionListResponseSchema>(
    '/writing-sessions/',
    params
  );
  return response.data;
}

export const useGetWritingSessionsQuery = (params?: PaginationRequestSchema) => {
  return useQuery<WritingSessionListResponseSchema, ErrorResponseSchema>({
    queryKey: ['writingSessions', params],
    queryFn: () => getWritingSessionsApi(params),
    refetchOnWindowFocus: false,
  });
};
