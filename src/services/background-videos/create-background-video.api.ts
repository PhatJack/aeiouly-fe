import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import {
  BackgroundVideoCreateSchema,
  BackgroundVideoResponseSchema,
} from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function createBackgroundVideoApi(body: BackgroundVideoCreateSchema) {
  const response = await apiClient.post<BackgroundVideoResponseSchema, BackgroundVideoCreateSchema>(
    '/background-videos/',
    body
  );
  return response.data;
}

export const useCreateBackgroundVideoMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    BackgroundVideoResponseSchema,
    ErrorResponseSchema,
    BackgroundVideoCreateSchema
  >({
    mutationKey: ['createBackgroundVideo'],
    mutationFn: (body) => createBackgroundVideoApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['background-videos'] });
    },
  });
};
