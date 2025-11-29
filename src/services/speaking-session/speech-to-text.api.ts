import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SpeechToTextResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SpeechToTextParams {
  audioFile: File;
  languageCode?: string;
  isSave?: boolean;
  autoDetect?: boolean;
}

export async function speechToTextApi({
  audioFile,
  languageCode = 'en-US',
  isSave = true,
  autoDetect = true,
}: SpeechToTextParams) {
  const form = new FormData();
  form.append('audio_file', audioFile);
  form.append('language_code', languageCode);
  if (isSave !== undefined) form.append('is_save', String(isSave));
  if (autoDetect !== undefined) form.append('auto_detect', String(autoDetect));
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
