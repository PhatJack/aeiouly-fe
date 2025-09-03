import {
  COOKIE_KEY_ACCESS_TOKEN,
  COOKIE_KEY_REFRESH_TOKEN,
} from "@/constants/cookies";
import { apiClient } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export const logoutApi = async () => {
  const response = await apiClient.post("/auth/logout", {});
  return response.data;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      deleteCookie(COOKIE_KEY_ACCESS_TOKEN);
      deleteCookie(COOKIE_KEY_REFRESH_TOKEN);
      deleteCookie("isLoggedIn");
    },
    onError: () => {
      deleteCookie(COOKIE_KEY_ACCESS_TOKEN);
      deleteCookie(COOKIE_KEY_REFRESH_TOKEN);
      deleteCookie("isLoggedIn");
    },
  });
};
