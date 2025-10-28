import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserResponseSchema } from '@/lib/schema/user.schema';
import { useQuery } from '@tanstack/react-query';

export async function getUserApi(userId: number) {
  const response = await apiClient.get<UserResponseSchema>(`/users/${userId}`);
  return response.data;
}

export const useGetUserQuery = (userId: number) => {
  return useQuery<UserResponseSchema, ErrorResponseSchema>({
    queryKey: ['user', userId],
    queryFn: () => getUserApi(userId),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};
