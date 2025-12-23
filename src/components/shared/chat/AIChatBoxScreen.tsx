import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/contexts/AuthContext';
import { MessageRole } from '@/lib/schema/enum.schema';
import { useSendChatbotMessageMutation } from '@/services/chatbot/send-chatbot-message.api';

import { Minus, SquarePen } from 'lucide-react';

import MessageContainer from './MessageContainer';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';

interface AIChatBoxScreenProps {
  setIsOpen: (isOpen: boolean) => void;
}

const AIChatBoxScreen = ({ setIsOpen }: AIChatBoxScreenProps) => {
  const user = useAuthStore((state) => state.user);
  const STORAGE_KEYS = {
    messages: 'ai_chat_messages',
    conversationId: 'ai_chat_conversation_id',
  } as const;

  const getDefaultMessages = () => [
    {
      role: 'assistant' as MessageRole,
      content: `Chào ${user?.username || ''}! Mình là Aeiouly AI Support. Mình có thể giúp gì cho bạn hôm nay?`,
    },
  ];

  const [conversationId, setConversationId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.conversationId);
  });

  const [messages, setMessages] = useState<Array<{ role: MessageRole; content: string }>>(() => {
    if (typeof window === 'undefined') return getDefaultMessages();
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    if (!stored) return getDefaultMessages();
    try {
      const parsed = JSON.parse(stored) as Array<{ role: MessageRole; content: string }>;
      return parsed.length ? parsed : getDefaultMessages();
    } catch (error) {
      console.error('Failed to parse stored chat messages', error);
      return getDefaultMessages();
    }
  });

  const sendChatBotMessage = useSendChatbotMessageMutation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (conversationId) {
      localStorage.setItem(STORAGE_KEYS.conversationId, conversationId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.conversationId);
    }
  }, [conversationId]);

  const handleNewChat = () => {
    setConversationId(null);
    const defaults = getDefaultMessages();
    setMessages(defaults);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.messages);
      localStorage.removeItem(STORAGE_KEYS.conversationId);
    }
  };

  const onSendMessage = async (message: string) => {
    // Thêm tin nhắn người dùng vào danh sách tin nhắn
    const newMessages = [...messages, { role: 'user' as MessageRole, content: message }];
    setMessages(newMessages);
    // Gọi API để gửi tin nhắn và nhận phản hồi từ chatbot
    sendChatBotMessage.mutate(
      { message, conversation_id: conversationId === null ? undefined : conversationId },
      {
        onSuccess: (data) => {
          // Cập nhật conversationId nếu chưa có
          if (!conversationId && data.conversation_id) {
            setConversationId(data.conversation_id);
          }
          // Thêm phản hồi từ chatbot vào danh sách tin nhắn
          const updatedMessages = [
            ...newMessages,
            { role: 'assistant' as MessageRole, content: data.response },
          ];
          setMessages(updatedMessages);
        },
      }
    );
  };

  return (
    <div className="flex size-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/catbox.png"
            alt="AI Icon"
            sizes="100vw"
            width={40}
            height={40}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/catbox.png"
          />
          <h2 className="font-medium">Aeiouly AI Support</h2>
        </div>
        <div className="flex items-center">
          <TooltipCustom content="Tạo chat mới" side="top">
            <Button
              variant={'ghost'}
              onClick={handleNewChat}
              size={'icon'}
              className="rounded-full"
            >
              <SquarePen />
            </Button>
          </TooltipCustom>
          <TooltipCustom content="Đóng chat" side="top">
            <Button
              variant={'ghost'}
              onClick={() => setIsOpen(false)}
              size={'icon'}
              className="rounded-full"
            >
              <Minus />
            </Button>
          </TooltipCustom>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <MessageContainer
            disableAssistantSpeak={true}
            className="bg-transparent px-0"
            messages={messages}
            isDetailPage={false}
          >
            {sendChatBotMessage.isPending && (
              <MessageItem
                content="Đang suy nghĩ..."
                senderRole="assistant"
                index={-1}
                isLoading={true}
              />
            )}
          </MessageContainer>
        </div>
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default AIChatBoxScreen;
