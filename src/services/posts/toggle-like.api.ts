import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { PostLikeResponseSchema } from "@/lib/schema/post.schema";
import { useMutation } from "@tanstack/react-query";

export async function togglePostLikeApi(postId: number) {
  const response = await apiClient.post<PostLikeResponseSchema>(
    `/posts/${postId}/like`,
    {}
  );
  return response.data;
}

export const useTogglePostLikeMutation = () => {

  return useMutation<PostLikeResponseSchema, ErrorResponseSchema, number>({
    mutationKey: ["togglePostLike"],
    mutationFn: (postId) => togglePostLikeApi(postId),
  });
};
