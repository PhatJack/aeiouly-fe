import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SoundResponseSchema, SoundUpdateSchema } from '@/lib/schema/sound.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateSoundApi(soundId: number, body: SoundUpdateSchema) {
  const response = await apiClient.put<SoundResponseSchema, SoundUpdateSchema>(
    `/sounds/${soundId}`,
    body
  );
  return response.data;
}

export const useUpdateSoundMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    SoundResponseSchema,
    ErrorResponseSchema,
    { soundId: number; data: SoundUpdateSchema }
  >({
    mutationKey: ['updateSound'],
    mutationFn: ({ soundId, data }) => updateSoundApi(soundId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sound', data.id] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
