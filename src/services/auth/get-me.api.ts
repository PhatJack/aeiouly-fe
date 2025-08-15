import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { UserSchema } from "@/lib/schema/user.schema";
import { useQuery } from "@tanstack/react-query";

export const getMeApi = async () => {
  const response = await apiClient.get<UserSchema>("/auth/me");
  return response.data;
};

export const useGetMeQuery = () => {
  return useQuery<UserSchema, ErrorResponseSchema>({
    queryKey: ["me"],
    queryFn: () => getMeApi(),
  });
};
