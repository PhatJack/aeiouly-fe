import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function deleteSoundApi(soundId: number) {
  const response = await apiClient.delete<{ message: string }>(`/sounds/${soundId}`);
  return response.data;
}

export const useDeleteSoundMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteSound'],
    mutationFn: (soundId) => deleteSoundApi(soundId),
    onSuccess: (_, soundId) => {
      queryClient.removeQueries({ queryKey: ['sound', soundId] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
