import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SoundCreateSchema, SoundResponseSchema } from '@/lib/schema/sound.schema';
import { useMutation } from '@tanstack/react-query';

export async function createSoundApi(body: SoundCreateSchema) {
  const response = await apiClient.post<SoundResponseSchema, SoundCreateSchema>('/sounds/', body);
  return response.data;
}

export const useCreateSoundMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<SoundResponseSchema, ErrorResponseSchema, SoundCreateSchema>({
    mutationKey: ['createSound'],
    mutationFn: (body) => createSoundApi(body),
    onSuccess: (data) => {
      queryClient.setQueryData(['sounds'], (oldData: SoundResponseSchema[] | undefined) => {
        return [...(oldData || []), data];
      });
    },
  });
};
