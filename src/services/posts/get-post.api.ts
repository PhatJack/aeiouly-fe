import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PostResponseSchema } from '@/lib/schema/post.schema';
import { useQuery } from '@tanstack/react-query';

export async function getPostApi(postId: number) {
  const response = await apiClient.get<PostResponseSchema>(`/posts/${postId}`);
  return response.data;
}

export const useGetPostQuery = (postId: number) => {
  return useQuery<PostResponseSchema, ErrorResponseSchema>({
    queryKey: ['post', postId],
    queryFn: () => getPostApi(postId),
    enabled: !!postId,
    refetchOnWindowFocus: false,
  });
};
