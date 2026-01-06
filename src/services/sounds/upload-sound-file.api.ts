import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SoundUploadResponseSchema } from '@/lib/schema/sound.schema';
import { useMutation } from '@tanstack/react-query';

export async function uploadSoundFileApi(soundId: number, soundFile: File) {
  const formData = new FormData();
  formData.append('sound_file', soundFile);

  const response = await apiClient.post<SoundUploadResponseSchema, FormData>(
    `/sounds/${soundId}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export const useUploadSoundFileMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    SoundUploadResponseSchema,
    ErrorResponseSchema,
    { soundId: number; soundFile: File }
  >({
    mutationKey: ['uploadSoundFile'],
    mutationFn: ({ soundId, soundFile }) => uploadSoundFileApi(soundId, soundFile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sound', data.id] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
