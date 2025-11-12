import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserResponseSchema, UserUpdateSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateUserApi(userId: number, body: UserUpdateSchema) {
  const response = await apiClient.put<UserResponseSchema, UserUpdateSchema>(
    `/users/${userId}`,
    body
  );
  return response.data;
}

export const useUpdateUserMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    UserResponseSchema,
    ErrorResponseSchema,
    { userId: number; data: UserUpdateSchema }
  >({
    mutationKey: ['updateUser'],
    mutationFn: ({ userId, data }) => updateUserApi(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
