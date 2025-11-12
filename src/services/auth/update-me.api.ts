import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserSchema, UserUpdateSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

export const updateMeApi = async (params: UserUpdateSchema) => {
  const response = await apiClient.post<UserSchema, UserUpdateSchema>('/auth/me', params);
  return response.data;
};

export const useUpdateMeMutation = () => {
  const queryClient = getQueryClient();
  return useMutation<UserSchema, ErrorResponseSchema, UserUpdateSchema>({
    mutationKey: ['update-me'],
    mutationFn: (body) => updateMeApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
