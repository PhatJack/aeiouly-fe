import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deletePostApi(postId: number) {
  const response = await apiClient.delete<{ message: string }>(`/posts/${postId}`);
  return response.data;
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deletePost'],
    mutationFn: (postId) => deletePostApi(postId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((post: any) => post.id !== postId),
        };
      });
      queryClient.removeQueries({ queryKey: ['post', postId] });
    },
  });
};
