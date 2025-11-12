import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import {
  BackgroundVideoResponseSchema,
  BackgroundVideoUpdateSchema,
} from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function updateBackgroundVideoApi(videoId: number, body: BackgroundVideoUpdateSchema) {
  const response = await apiClient.put<BackgroundVideoResponseSchema, BackgroundVideoUpdateSchema>(
    `/background-videos/${videoId}`,
    body
  );
  return response.data;
}

export const useUpdateBackgroundVideoMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    BackgroundVideoResponseSchema,
    ErrorResponseSchema,
    { videoId: number; data: BackgroundVideoUpdateSchema }
  >({
    mutationKey: ['updateBackgroundVideo'],
    mutationFn: ({ videoId, data }) => updateBackgroundVideoApi(videoId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['background-video', data.id] });
      queryClient.invalidateQueries({ queryKey: ['background-videos'] });
    },
  });
};
