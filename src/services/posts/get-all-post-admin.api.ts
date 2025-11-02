import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { PostListResponseSchema } from '@/lib/schema/post.schema';
import { useQuery } from '@tanstack/react-query';

export async function getAllPostsAdminApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<PostListResponseSchema>('/posts/admin/all', params);
  return response.data;
}

export const useGetAllPostsAdminQuery = (params?: PaginationRequestSchema) => {
  return useQuery<PostListResponseSchema, ErrorResponseSchema>({
    queryKey: ['posts-admin-all', params],
    queryFn: () => getAllPostsAdminApi(params),
    refetchOnWindowFocus: false,
  });
};
