import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { SessionGoalListResponseSchema } from '@/lib/schema/session-goal.schema';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { isAxiosError } from 'axios';

interface GetSessionGoalsParams extends PaginationRequestSchema {
  status?: 'OPEN' | 'COMPLETED';
}

interface GetInfiniteSessionGoalsParams extends PaginationRequestSchema {
  status?: 'OPEN' | 'COMPLETED';
  user?: number | undefined;
}

export async function getAllSessionGoalsApi(params?: GetSessionGoalsParams) {
  const response = await apiClient.get<SessionGoalListResponseSchema>('/session-goals/', params);
  return response.data;
}

export const useGetAllSessionGoalsQuery = (params?: GetSessionGoalsParams) => {
  return useQuery<SessionGoalListResponseSchema, ErrorResponseSchema>({
    queryKey: ['session-goals', params],
    queryFn: () => getAllSessionGoalsApi(params),
    refetchOnWindowFocus: false,
  });
};

export const useGetAllSessionGoalsInfiniteQuery = (params: GetInfiniteSessionGoalsParams = {}) => {
  //   GoalResponseBodySchema, // TQueryFnData: Raw data from the query
  // unknown, // TError: Error type
  // GoalResponseBodySchema, // TData: Transformed/selected data
  // Array<string | GoalQuerySchema>, // TQueryKey: Query key type
  // number // TPageParam: Page parameter type
  const queryKey = ['session-goals-infinite', params];
  return useInfiniteQuery<
    SessionGoalListResponseSchema,
    ErrorResponseSchema,
    SessionGoalListResponseSchema,
    Array<string | GetInfiniteSessionGoalsParams>,
    number
  >({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getAllSessionGoalsApi({ ...params, page: pageParam, size: params?.size ?? 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage > lastPage.pages ? undefined : nextPage;
    },
    getPreviousPageParam: (firstPage) => {
      const previousPage = firstPage.page - 1;
      return previousPage < 1 ? undefined : previousPage;
    },
    select: (data) => ({
      page: data.pages[0]?.page || 1,
      size: params?.size ?? 10,
      total: data.pages[0]?.total || 0,
      pages: data.pages[0]?.pages || 0,
      items: data.pages.flatMap((page) => page.items),
    }),
    throwOnError: isAxiosError,
    refetchOnWindowFocus: false,
  });
};
