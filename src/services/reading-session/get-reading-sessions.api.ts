import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import {
  CEFRLevel,
  ReadingGenre,
  ReadingSessionListResponseSchema,
} from '@/lib/schema/reading-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export interface GetReadingSessionsParams extends PaginationRequestSchema {
  level?: CEFRLevel;
  genre?: ReadingGenre;
  is_custom?: boolean;
}

export async function getReadingSessionsApi(params?: GetReadingSessionsParams) {
  const response = await apiClient.get<ReadingSessionListResponseSchema>(
    '/reading-sessions',
    params
  );
  return response.data;
}

export const useGetReadingSessionsQuery = (
  params?: GetReadingSessionsParams,
  options?: Omit<
    UseQueryOptions<ReadingSessionListResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<ReadingSessionListResponseSchema, ErrorResponseSchema>({
    queryKey: ['readingSessions', params],
    queryFn: () => getReadingSessionsApi(params),
    refetchOnWindowFocus: false,
    ...options,
  });
};
