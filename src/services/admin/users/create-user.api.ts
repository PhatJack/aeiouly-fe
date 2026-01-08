import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserCreateSchema, UserResponseSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

export async function createUserApi(body: UserCreateSchema) {
  const response = await apiClient.post<UserResponseSchema, UserCreateSchema>('/users/', body);
  return response.data;
}

export const useCreateUserMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<UserResponseSchema, ErrorResponseSchema, UserCreateSchema>({
    mutationKey: ['createUser'],
    mutationFn: (body) => createUserApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
