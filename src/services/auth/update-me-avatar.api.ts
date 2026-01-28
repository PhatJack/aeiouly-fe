import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserCreateImageSchema, userResponseSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

const updateUserAvatarResponseSchema = createBaseResponseSchema(userResponseSchema);

type UpdateUserAvatarResponseSchema = z.infer<typeof updateUserAvatarResponseSchema>;

export async function updateUserImageApi(body: UserCreateImageSchema) {
  const response = await apiClient.post<UpdateUserAvatarResponseSchema, UserCreateImageSchema>(
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
  const queryClient = getQueryClient();
  return useMutation<
    UpdateUserAvatarResponseSchema,
    ErrorResponseSchema,
    { body: UserCreateImageSchema }
  >({
    mutationKey: ['updateUserImage'],
    meta: {
      ignoreGlobal: true,
    },
    mutationFn: ({ body }) => updateUserImageApi(body),
  });
};
