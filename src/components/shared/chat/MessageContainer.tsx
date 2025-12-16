'use client';

import React, { memo, useLayoutEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import MessageItem from './MessageItem';

interface MessageContainerProps {
  messages: any[];
  senderId?: number;
  historyMessageIds?: Set<string>;
  disableAssistantSpeak?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function MessageContainer({
  messages,
  historyMessageIds,
  disableAssistantSpeak,
  children,
  className,
}: MessageContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // Use rAF to ensure DOM/layout is settled before scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [messages.length]);

  return (
    <div
      className={cn(
        'dark:bg-background flex h-full max-h-dvh scroll-mr-1 flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50 px-4 lg:max-h-full',
        className
      )}
    >
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          <MessageItem
            index={message.id || index}
            content={message.content}
            senderRole={message.role}
            audioUrl={message.audio_url}
            translation_sentence={message.translation_sentence}
            disableAssistantSpeak={disableAssistantSpeak}
            disableTyping={
              historyMessageIds
                ? historyMessageIds.has(`${message.session_id}_${message.role}_${message.id}`)
                : true
            }
          />
        </div>
      ))}
      {children}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default memo(MessageContainer);
