import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { UserSchema } from "@/lib/schema/user.schema";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";

export const getMeApi = async () => {
  const response = await apiClient.get<UserSchema>("/auth/me");
  return response.data;
};

export const useGetMeQuery = () => {
  return useQuery<UserSchema, ErrorResponseSchema>({
    queryKey: ["me"],
    queryFn: () => getMeApi(),
    enabled: !!getCookie("isLoggedIn"),
    retry: false, // Don't retry on failure to prevent infinite requests
    refetchOnWindowFocus: false
  });
};
