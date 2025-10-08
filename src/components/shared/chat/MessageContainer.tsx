'use client';

import React from 'react';

import { cn } from '@/lib/utils';

import MessageItem from './MessageItem';

interface MessageContainerProps {
  messages: string[];
  senderId?: number;
  className?: string;
}

const MessageContainer = ({ messages, className }: MessageContainerProps) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50 p-4',
        className
      )}
    >
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          index={index}
          content={message}
          senderId={index % 2 === 0 ? 1 : 2}
        />
      ))}
    </div>
  );
};

export default React.memo(MessageContainer);
