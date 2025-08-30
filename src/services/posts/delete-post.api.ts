import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function deletePostApi(postId: number) {
  const response = await apiClient.delete<{ message: string }>(
    `/posts/${postId}`
  );
  return response.data;
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ["deletePost"],
    mutationFn: (postId) => deletePostApi(postId),
    onSuccess: (_, postId) => {
      // Remove specific post from cache and invalidate posts list
      queryClient.removeQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
