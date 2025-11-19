'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

import MessageContainer from '@/components/shared/chat/MessageContainer';
import MessageInput from '@/components/shared/chat/MessageInput';
import MessageItem from '@/components/shared/chat/MessageItem';
import { WritingSessionContext } from '@/contexts/WritingSessionContext';
import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { cn } from '@/lib/utils';
import { useGetChatHistoryQuery, useSendChatMessageMutation } from '@/services/writing-session';

import { useContextSelector } from 'use-context-selector';

interface ChatSectionProps {
  sessionId: number;
  className?: string;
}

const ChatSection = ({ sessionId, className }: ChatSectionProps) => {
  const currentSentenceIndex = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx?.currentSentenceIndex ?? 0
  );
  const handleSelectedSentenceIndex = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx!.handleSelectedSentenceIndex
  );

  const { data: chatHistory } = useGetChatHistoryQuery(sessionId, {
    refetchOnWindowFocus: false,
  });

  const [localMessages, setLocalMessages] = useState<ChatMessageResponseSchema[]>([]);
  const sendChatMutation = useSendChatMessageMutation();
  const [historyMessageIds, setHistoryMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setLocalMessages(chatHistory);
      handleSelectedSentenceIndex?.(chatHistory[chatHistory.length - 1].sentence_index ?? 0);
      // Track the IDs of messages from chat history (disable typing for these)
      setHistoryMessageIds(new Set(chatHistory.map((m) => `${m.session_id}_${m.role}_${m.id}`)));
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const optimisticUserMessage: ChatMessageResponseSchema = {
      id: Date.now(), // Temporary ID
      session_id: sessionId,
      role: 'user',
      content: content.trim(),
      sentence_index: null,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, optimisticUserMessage]);
    // Send message to API
    sendChatMutation
      .mutateAsync({ sessionId, message: { content: content.trim() } })
      .then((res) => {
        if (
          handleSelectedSentenceIndex &&
          res.sentence_index !== null &&
          res.sentence_index > currentSentenceIndex
        ) {
          handleSelectedSentenceIndex(res.sentence_index);
        }
        setLocalMessages((prev) => [...prev, res]);
      });
  };

  return (
    <div
      className={cn(
        'border-border/50 dark:bg-background flex flex-col rounded-2xl border bg-gray-50 p-4',
        className
      )}
    >
      {/* Messages Container */}
      <MessageContainer
        messages={localMessages}
        historyMessageIds={historyMessageIds}
        className="mb-4 flex-1"
      >
        {sendChatMutation.isPending && (
          <MessageItem
            content="Đang suy nghĩ..."
            senderRole="assistant"
            index={-1}
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={sendChatMutation.isPending} />
    </div>
  );
};

export default memo(ChatSection);
