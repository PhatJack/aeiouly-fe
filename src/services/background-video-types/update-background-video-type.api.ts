import { apiClient } from '@/lib/client';
import {
  BackgroundVideoTypeResponseSchema,
  BackgroundVideoTypeUpdateSchema,
} from '@/lib/schema/background-video.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function updateBackgroundVideoTypeApi(
  typeId: number,
  body: BackgroundVideoTypeUpdateSchema
) {
  const response = await apiClient.put<
    BackgroundVideoTypeResponseSchema,
    BackgroundVideoTypeUpdateSchema
  >(`/background-video-types/${typeId}`, body);
  return response.data;
}

export const useUpdateBackgroundVideoTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BackgroundVideoTypeResponseSchema,
    ErrorResponseSchema,
    { typeId: number; data: BackgroundVideoTypeUpdateSchema }
  >({
    mutationKey: ['updateBackgroundVideoType'],
    mutationFn: ({ typeId, data }) => updateBackgroundVideoTypeApi(typeId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['background-video-type', data.id] });
      queryClient.invalidateQueries({ queryKey: ['background-video-types'] });
    },
  });
};
