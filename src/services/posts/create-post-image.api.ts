import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PostCreateImageSchema, PostResponseSchema } from '@/lib/schema/post.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function createPostImageApi(post_id: number, body: PostCreateImageSchema) {
  const response = await apiClient.post<PostResponseSchema, PostCreateImageSchema>(
    `/posts/${post_id}/image`,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export const useCreatePostImageMutation = () => {
  return useMutation<
    PostResponseSchema,
    ErrorResponseSchema,
    { post_id: number; body: PostCreateImageSchema }
  >({
    mutationKey: ['createPostImage'],
    mutationFn: ({ post_id, body }) => createPostImageApi(post_id, body),
  });
};
