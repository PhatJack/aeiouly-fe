import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  ChatMessageCreateSchema,
  ChatMessageResponseSchema,
} from '@/lib/schema/writing-session.schema';
import { useMutation } from '@tanstack/react-query';

interface SendChatMessageParams {
  sessionId: number;
  message: ChatMessageCreateSchema;
}

export async function sendChatMessageApi(sessionId: number, body: ChatMessageCreateSchema) {
  const response = await apiClient.post<ChatMessageResponseSchema, ChatMessageCreateSchema>(
    `/writing-sessions/${sessionId}/chat`,
    body
  );
  return response.data;
}

export const useSendChatMessageMutation = () => {
  return useMutation<ChatMessageResponseSchema, ErrorResponseSchema, SendChatMessageParams>({
    mutationKey: ['sendChatMessage'],
    mutationFn: ({ sessionId, message }) => sendChatMessageApi(sessionId, message),
  });
};
