import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserFilterRequestSchema } from '@/lib/schema/pagination';
import { UserListResponseSchema } from '@/lib/schema/user.schema';
import { useQuery } from '@tanstack/react-query';

export async function getAllUsersApi(params?: UserFilterRequestSchema) {
  const response = await apiClient.get<UserListResponseSchema>('/users/', params);
  return response.data;
}

export const useGetAllUsersQuery = (params?: UserFilterRequestSchema) => {
  return useQuery<UserListResponseSchema, ErrorResponseSchema>({
    queryKey: ['users', params],
    queryFn: () => getAllUsersApi(params),
    meta: {
      ignoreGlobal: true,
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
