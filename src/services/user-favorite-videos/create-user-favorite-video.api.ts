import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  UserFavoriteVideoCreateSchema,
  UserFavoriteVideoResponseSchema,
} from '@/lib/schema/user-favorite-video.schema';
import { useMutation } from '@tanstack/react-query';

export async function createUserFavoriteVideoApi(body: UserFavoriteVideoCreateSchema) {
  const response = await apiClient.post<
    UserFavoriteVideoResponseSchema,
    UserFavoriteVideoCreateSchema
  >('/user-favorite-videos/', body);
  return response.data;
}

export const useCreateUserFavoriteVideoMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    UserFavoriteVideoResponseSchema,
    ErrorResponseSchema,
    UserFavoriteVideoCreateSchema
  >({
    mutationKey: ['createUserFavoriteVideo'],
    mutationFn: (body) => createUserFavoriteVideoApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavoriteVideos'] });
    },
  });
};
