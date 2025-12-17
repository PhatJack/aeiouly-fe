import { apiClient } from '@/lib/client';
import { ChatBotBodySchema, ChatBotResponseSchema } from '@/lib/schema/chatbot.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function sendChatbotMessageApi(body: ChatBotBodySchema) {
  const response = await apiClient.post<ChatBotResponseSchema, ChatBotBodySchema>(
    '/chatbot/message',
    body
  );
  return response.data;
}

export const useSendChatbotMessageMutation = (
  options?: Omit<
    UseMutationOptions<ChatBotResponseSchema, ErrorResponseSchema, ChatBotBodySchema>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<ChatBotResponseSchema, ErrorResponseSchema, ChatBotBodySchema>({
    mutationKey: ['sendChatbotMessage'],
    mutationFn: (body: ChatBotBodySchema) => sendChatbotMessageApi(body),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
