import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  ChatMessageCreateSchema,
  SpeakingChatMessageResponseSchema,
} from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SendSpeakingChatMessageParams {
  sessionId: number;
  message: ChatMessageCreateSchema;
  audioFile?: string;
}

export async function sendSpeakingChatMessageApi(
  sessionId: number,
  body: ChatMessageCreateSchema,
  audioFile?: string
) {
  let data: any = body;
  if (audioFile || !body.content) {
    const form = new FormData();
    if (body.content) form.append('content', body.content);
    if (audioFile) form.append('audio_url', audioFile);
    data = form;
  }
  const response = await apiClient.post<SpeakingChatMessageResponseSchema, typeof data>(
    `/speaking-sessions/${sessionId}/chat`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export const useSendSpeakingChatMessageMutation = (
  options?: Omit<
    UseMutationOptions<
      SpeakingChatMessageResponseSchema,
      ErrorResponseSchema,
      SendSpeakingChatMessageParams
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<
    SpeakingChatMessageResponseSchema,
    ErrorResponseSchema,
    SendSpeakingChatMessageParams
  >({
    mutationKey: ['sendSpeakingChatMessage'],
    mutationFn: ({ sessionId, message, audioFile }) =>
      sendSpeakingChatMessageApi(sessionId, message, audioFile),
    meta: { ignoreGlobal: true },
    ...options,
  });
};
