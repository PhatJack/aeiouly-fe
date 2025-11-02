import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { PostListResponseSchema } from '@/lib/schema/post.schema';
import {
  infiniteQueryOptions,
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

export async function getAllPostsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<PostListResponseSchema>('/posts/', params);
  return response.data;
}

export const useGetAllPostsQuery = (params?: PaginationRequestSchema) => {
  return useQuery<PostListResponseSchema, ErrorResponseSchema>({
    queryKey: ['posts', params],
    queryFn: () => getAllPostsApi(params),
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteGetAllPostsQuery = (params?: PaginationRequestSchema) => {
  return infiniteQueryOptions<
    PostListResponseSchema,
    ErrorResponseSchema,
    PostListResponseSchema,
    unknown[],
    unknown
  >({
    queryKey: ['posts', params],
    queryFn: ({ pageParam = 1 }) => getAllPostsApi({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage > lastPage.pages ? undefined : nextPage;
    },
    getPreviousPageParam: (firstPage) => {
      const previousPage = firstPage.page - 1;
      return previousPage < 1 ? undefined : previousPage;
    },
    placeholderData: keepPreviousData,
    meta: { ignoreGlobal: true },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
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
