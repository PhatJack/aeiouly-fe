'use client';

import React, { memo } from 'react';

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
  return (
    <div
      id="message-container"
      className={cn(
        'dark:bg-background flex h-full flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50',
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
    </div>
  );
}

export default memo(MessageContainer);
