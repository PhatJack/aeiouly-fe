import { apiClient } from '@/lib/client';
import { BackgroundVideoResponseSchema } from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function uploadBackgroundVideoImageApi(videoId: number, imageFile: File) {
  const formData = new FormData();
  formData.append('image_file', imageFile);

  const response = await apiClient.post<BackgroundVideoResponseSchema, FormData>(
    `/background-videos/${videoId}/upload-image`,
    formData
  );
  return response.data;
}

export const useUploadBackgroundVideoImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BackgroundVideoResponseSchema,
    ErrorResponseSchema,
    { videoId: number; imageFile: File }
  >({
    mutationKey: ['uploadBackgroundVideoImage'],
    mutationFn: ({ videoId, imageFile }) => uploadBackgroundVideoImageApi(videoId, imageFile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['background-video', data.id] });
      queryClient.invalidateQueries({ queryKey: ['background-videos'] });
    },
  });
};
