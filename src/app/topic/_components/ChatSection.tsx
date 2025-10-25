'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

import MessageInput from '@/components/shared/chat/MessageInput';
import MessageItem from '@/components/shared/chat/MessageItem';
import { WritingSessionContext } from '@/contexts/WritingSessionContext';
import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { cn } from '@/lib/utils';
import { sendChatMessageApi } from '@/services/writing-session';

import { useContextSelector } from 'use-context-selector';

interface ChatSectionProps {
  sessionId: number;
  messages: ChatMessageResponseSchema[];
  className?: string;
}

const ChatSection = ({ sessionId, messages, className }: ChatSectionProps) => {
  const handleSelectedSentenceIndex = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx!.handleSelectedSentenceIndex
  );
  const [localMessages, setLocalMessages] = useState<ChatMessageResponseSchema[]>(messages);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [historyMessageIds, setHistoryMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update local messages when messages prop changes
  useEffect(() => {
    setLocalMessages(messages);
    // Track the IDs of messages from chat history (disable typing for these)
    setHistoryMessageIds(new Set(messages.map((m) => `${m.session_id}_${m.role}_${m.id}`)));
  }, [messages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isLoadingResponse]);

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
    setIsLoadingResponse(true);

    // Send message to API
    const res = await sendChatMessageApi(sessionId, { content: content.trim() });
    if (res) {
      if (handleSelectedSentenceIndex && res.sentence_index !== null) {
        handleSelectedSentenceIndex(res.sentence_index);
      }
      setLocalMessages((prev) => [...prev, res]);
      setIsLoadingResponse(false);
    }
  };

  return (
    <div
      className={cn('border-border/50 flex flex-col rounded-2xl border bg-gray-50 p-6', className)}
    >
      {/* Messages Container */}
      <div className="scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent mb-6 flex-1 space-y-4 overflow-y-auto pr-2">
        {localMessages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <MessageItem
              content={message.content}
              senderRole={message.role}
              index={message.id}
              translationAvailable={false}
              disableTyping={historyMessageIds.has(
                `${message.session_id}_${message.role}_${message.id}`
              )}
            />
          </div>
        ))}
        {isLoadingResponse && (
          <MessageItem
            content="Thinking..."
            senderRole="assistant"
            index={-1}
            isLoading={true}
            translationAvailable={false}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoadingResponse} />
    </div>
  );
};

export default memo(ChatSection);
