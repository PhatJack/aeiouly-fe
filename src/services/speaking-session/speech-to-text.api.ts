import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SpeechToTextResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SpeechToTextParams {
  audioFile: File;
  languageCode?: string;
}

export async function speechToTextApi({ audioFile, languageCode = 'en-US' }: SpeechToTextParams) {
  const form = new FormData();
  form.append('audio_file', audioFile);
  form.append('language_code', languageCode);
  const response = await apiClient.post<SpeechToTextResponseSchema, FormData>(
    '/speaking-sessions/speech-to-text',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export const useSpeechToTextMutation = (
  options?: Omit<
    UseMutationOptions<SpeechToTextResponseSchema, ErrorResponseSchema, SpeechToTextParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<SpeechToTextResponseSchema, ErrorResponseSchema, SpeechToTextParams>({
    mutationKey: ['speechToText'],
    mutationFn: (params) => speechToTextApi(params),
    meta: { ignoreGlobal: true },
    ...options,
  });
};
