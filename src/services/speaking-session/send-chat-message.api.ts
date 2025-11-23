import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  ChatMessageCreateSchema,
  ChatMessageResponseSchema,
} from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SendSpeakingChatMessageParams {
  sessionId: number;
  message: ChatMessageCreateSchema;
  audioFile?: File; // optional audio upload
}

export async function sendSpeakingChatMessageApi(
  sessionId: number,
  body: ChatMessageCreateSchema,
  audioFile?: File
) {
  let data: any = body;
  let config: any = undefined;
  // If audio provided, use FormData
  if (audioFile || !body.content) {
    const form = new FormData();
    if (body.content) form.append('content', body.content);
    if (audioFile) form.append('audio_file', audioFile);
    data = form;
    config = { headers: { 'Content-Type': 'multipart/form-data' } };
  }
  const response = await apiClient.post<ChatMessageResponseSchema, typeof data>(
    `/speaking-sessions/${sessionId}/chat`,
    data,
    config
  );
  return response.data;
}

export const useSendSpeakingChatMessageMutation = (
  options?: Omit<
    UseMutationOptions<
      ChatMessageResponseSchema,
      ErrorResponseSchema,
      SendSpeakingChatMessageParams
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<ChatMessageResponseSchema, ErrorResponseSchema, SendSpeakingChatMessageParams>(
    {
      mutationKey: ['sendSpeakingChatMessage'],
      mutationFn: ({ sessionId, message, audioFile }) =>
        sendSpeakingChatMessageApi(sessionId, message, audioFile),
      meta: { ignoreGlobal: true },
      ...options,
    }
  );
};
