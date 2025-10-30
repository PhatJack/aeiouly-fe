import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { UserFavoriteVideoListResponseSchema } from '@/lib/schema/user-favorite-video.schema';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

export async function getAllUserFavoriteVideosApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<UserFavoriteVideoListResponseSchema>(
    '/user-favorite-videos/',
    params
  );
  return response.data;
}

export const useInfiniteGetAllUserFavoriteVideosQuery = (params?: PaginationRequestSchema) => {
  return infiniteQueryOptions<
    UserFavoriteVideoListResponseSchema,
    ErrorResponseSchema,
    UserFavoriteVideoListResponseSchema,
    unknown[],
    unknown
  >({
    queryKey: ['userFavoriteVideos', params],
    queryFn: ({ pageParam = 1 }) =>
      getAllUserFavoriteVideosApi({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage > lastPage.total ? undefined : nextPage;
    },
    getPreviousPageParam: (firstPage) => {
      const previousPage = firstPage.page - 1;
      return previousPage < 1 ? undefined : previousPage;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => ({
      total: data.pages[0]?.total || 0,
      page: data.pages[0]?.page || 1,
      size: data.pages[0]?.size || 0,
      items: data.pages.flatMap((page) => page.items),
      pages: data.pages[0]?.pages || 0,
      pageParams: data.pageParams,
    }),
  });
};
