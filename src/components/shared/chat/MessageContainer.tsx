'use client';

import React, { memo, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import MessageItem from './MessageItem';

interface MessageContainerProps {
  messages: any[];
  senderId?: number;
  historyMessageIds?: Set<string>;
  children?: React.ReactNode;
  className?: string;
}

function MessageContainer({
  messages,
  historyMessageIds,
  children,
  className,
}: MessageContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollTo({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div
      id="message-container"
      className={cn(
        'dark:bg-background flex h-full max-h-dvh flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50 lg:max-h-full',
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
