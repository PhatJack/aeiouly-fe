import z from "zod";
import { loginResponseSchema } from "./login.api";
import { apiClient } from "@/lib/client";

export const refreshTokenResponseSchema = loginResponseSchema;

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export async function refreshTokenApi() {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    {}
  );
  return response.data;
}
