import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { UserListResponseSchema } from '@/lib/schema/user.schema';
import { useQuery } from '@tanstack/react-query';

export async function getAllUsersApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<UserListResponseSchema>('/users/', params);
  return response.data;
}

export const useGetAllUsersQuery = (params?: PaginationRequestSchema) => {
  return useQuery<UserListResponseSchema, ErrorResponseSchema>({
    queryKey: ['users', params],
    queryFn: () => getAllUsersApi(params),
    refetchOnWindowFocus: false,
  });
};
