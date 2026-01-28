import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserUpdateSchema, userResponseSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

const updateMeResponseSchema = createBaseResponseSchema(userResponseSchema);

type UpdateMeResponseSchema = z.infer<typeof updateMeResponseSchema>;

export const updateMeApi = async (params: UserUpdateSchema) => {
  const response = await apiClient.post<UpdateMeResponseSchema, UserUpdateSchema>(
    '/auth/me',
    params
  );
  return response.data;
};

export const useUpdateMeMutation = () => {
  const queryClient = getQueryClient();
  return useMutation<UpdateMeResponseSchema, ErrorResponseSchema, UserUpdateSchema>({
    mutationKey: ['update-me'],
    mutationFn: (body) => updateMeApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
