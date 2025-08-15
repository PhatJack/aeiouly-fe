import {
  COOKIE_KEY_ACCESS_TOKEN,
  COOKIE_KEY_REFRESH_TOKEN,
} from "@/constants/cookies";
import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { setCookie } from "cookies-next";

export const loginBodySchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});

export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number(),
});

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

export async function loginApi(
  body: LoginBodySchema
): Promise<LoginResponseSchema> {
  const response = await apiClient.post<LoginResponseSchema, LoginBodySchema>(
    "/auth/login/",
    body
  );
  return response.data;
}

export const useLoginMutation = () => {
  return useMutation<LoginResponseSchema, ErrorResponseSchema, LoginBodySchema>(
    {
      mutationKey: ["login"],
      mutationFn: (body) => loginApi(body),
      onSuccess: (data) => {
        setCookie(COOKIE_KEY_ACCESS_TOKEN, data.access_token);
        setCookie(COOKIE_KEY_REFRESH_TOKEN, data.refresh_token);
      },
    }
  );
};
