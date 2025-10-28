import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserResetPasswordSchema, UserResponseSchema } from '@/lib/schema/user.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function resetUserPasswordApi(userId: number, body: UserResetPasswordSchema) {
  const response = await apiClient.post<UserResponseSchema, UserResetPasswordSchema>(
    `/users/${userId}/reset-password`,
    body
  );
  return response.data;
}

export const useResetUserPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponseSchema,
    ErrorResponseSchema,
    { userId: number; data: UserResetPasswordSchema }
  >({
    mutationKey: ['resetUserPassword'],
    mutationFn: ({ userId, data }) => resetUserPasswordApi(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
