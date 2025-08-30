import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { PostLikeResponseSchema } from "@/lib/schema/post.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function togglePostLikeApi(postId: number) {
  const response = await apiClient.post<PostLikeResponseSchema>(
    `/posts/${postId}/like`,
    {}
  );
  return response.data;
}

export const useTogglePostLikeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PostLikeResponseSchema, ErrorResponseSchema, number>({
    mutationKey: ["togglePostLike"],
    mutationFn: (postId) => togglePostLikeApi(postId),
    onSuccess: (data) => {
      // Update specific post data
      queryClient.invalidateQueries({ queryKey: ["post", data.post_id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
