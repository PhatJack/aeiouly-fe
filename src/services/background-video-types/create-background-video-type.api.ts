import { apiClient } from '@/lib/client';
import {
  BackgroundVideoTypeCreateSchema,
  BackgroundVideoTypeResponseSchema,
} from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function createBackgroundVideoTypeApi(body: BackgroundVideoTypeCreateSchema) {
  const response = await apiClient.post<
    BackgroundVideoTypeResponseSchema,
    BackgroundVideoTypeCreateSchema
  >('/background-video-types/', body);
  return response.data;
}

export const useCreateBackgroundVideoTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BackgroundVideoTypeResponseSchema,
    ErrorResponseSchema,
    BackgroundVideoTypeCreateSchema
  >({
    mutationKey: ['createBackgroundVideoType'],
    mutationFn: (body) => createBackgroundVideoTypeApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background-video-types'] });
    },
  });
};
