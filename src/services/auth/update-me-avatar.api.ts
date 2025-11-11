import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserCreateImageSchema, UserResponseSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateUserImageApi(body: UserCreateImageSchema) {
  const response = await apiClient.post<UserResponseSchema, UserCreateImageSchema>(
    `/auth/me/avatar`,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export const useUpdateUserImageMutation = () => {
  return useMutation<UserResponseSchema, ErrorResponseSchema, { body: UserCreateImageSchema }>({
    mutationKey: ['updateUserImage'],
    meta: {
      ignoreGlobal: true,
    },
    mutationFn: ({ body }) => updateUserImageApi(body),
  });
};
