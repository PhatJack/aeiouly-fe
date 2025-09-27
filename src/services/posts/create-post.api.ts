import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PostCreateSchema, PostResponseSchema } from '@/lib/schema/post.schema';
import { useMutation } from '@tanstack/react-query';

export async function createPostApi(body: PostCreateSchema) {
  const response = await apiClient.post<PostResponseSchema, PostCreateSchema>('/posts/', body);
  return response.data;
}

export const useCreatePostMutation = () => {
  return useMutation<PostResponseSchema, ErrorResponseSchema, PostCreateSchema>({
    mutationKey: ['createPost'],
    mutationFn: (body) => createPostApi(body),
    onSuccess: () => {
      // Invalidate posts list to refetch
    },
  });
};
