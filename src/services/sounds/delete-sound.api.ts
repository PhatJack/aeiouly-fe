import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteSoundApi(soundId: number) {
  const response = await apiClient.delete<{ message: string }>(`/sounds/${soundId}`);
  return response.data;
}

export const useDeleteSoundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteSound'],
    mutationFn: (soundId) => deleteSoundApi(soundId),
    onSuccess: (_, soundId) => {
      queryClient.removeQueries({ queryKey: ['sound', soundId] });
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
};
