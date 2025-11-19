'use client';

import React from 'react';

import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { cn } from '@/lib/utils';

import MessageItem from './MessageItem';

interface MessageContainerProps {
  messages: ChatMessageResponseSchema[];
  senderId?: number;
  historyMessageIds?: Set<string>;
  children?: React.ReactNode;
  className?: string;
}

const MessageContainer = ({
  messages,
  historyMessageIds,
  children,
  className,
}: MessageContainerProps) => {
  return (
    <div
      className={cn(
        'scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent dark:bg-background flex h-full flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50',
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
};

export default React.memo(MessageContainer);
