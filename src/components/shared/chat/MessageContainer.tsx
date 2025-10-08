import React from 'react';

import { cn } from '@/lib/utils';

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
        <div
          key={index}
          className={cn(
            'max-w-sm rounded-lg p-3 break-words',
            index % 2 === 0
              ? 'bg-primary/85 ml-auto self-end text-white'
              : 'mr-auto self-start bg-gray-200 text-gray-800'
          )}
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default React.memo(MessageContainer);
