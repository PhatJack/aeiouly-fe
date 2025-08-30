import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { PostUpdateSchema, PostResponseSchema } from "@/lib/schema/post.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updatePostApi(postId: number, body: PostUpdateSchema) {
  const response = await apiClient.put<PostResponseSchema, PostUpdateSchema>(
    `/posts/${postId}`,
    body
  );
  return response.data;
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PostResponseSchema, ErrorResponseSchema, { postId: number; data: PostUpdateSchema }>({
    mutationKey: ["updatePost"],
    mutationFn: ({ postId, data }) => updatePostApi(postId, data),
    onSuccess: (data) => {
      // Invalidate and update specific post
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
