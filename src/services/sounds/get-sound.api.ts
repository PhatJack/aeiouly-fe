import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SoundResponseSchema } from '@/lib/schema/sound.schema';
import { useQuery } from '@tanstack/react-query';

export async function getSoundApi(soundId: number) {
  const response = await apiClient.get<SoundResponseSchema>(`/sounds/${soundId}`);
  return response.data;
}

export const useGetSoundQuery = (soundId: number) => {
  return useQuery<SoundResponseSchema, ErrorResponseSchema>({
    queryKey: ['sound', soundId],
    queryFn: () => getSoundApi(soundId),
    refetchOnWindowFocus: false,
    enabled: !!soundId,
  });
};
