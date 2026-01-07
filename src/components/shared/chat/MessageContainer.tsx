'use client';

import React, { memo, useLayoutEffect, useRef } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';

import MessageItem from './MessageItem';

interface MessageContainerProps {
  messages: any[];
  senderId?: number;
  historyMessageIds?: Set<string>;
  disableAssistantSpeak?: boolean;
  children?: React.ReactNode;
  className?: string;
  isDetailPage?: boolean;
  backUrl?: string;
  voice?: string;
}

function MessageContainer({
  messages,
  historyMessageIds,
  disableAssistantSpeak,
  children,
  className,
  isDetailPage = true,
  backUrl,
  voice,
}: MessageContainerProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [messages.length]);

  return (
    <ScrollArea
      className={cn(
        'dark:bg-background relative flex h-full max-h-dvh scroll-mr-1 flex-col space-y-3 overflow-y-auto rounded-xl bg-gray-50 px-4 lg:max-h-full',
        className,
        isDetailPage ? 'pt-12 pb-4' : ''
      )}
    >
      {isDetailPage && (
        <div className="dark:from-background absolute top-0 right-0 left-0 z-50 flex h-12 bg-gradient-to-b from-gray-50 px-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => (backUrl ? router.push(backUrl) : router.back())}
          >
            <ArrowLeft />
          </Button>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={`message_${message.session_id}_${message.id}_${message.role}`}
          className={cn('mb-4 flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
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
            voice={voice}
          />
        </div>
      ))}
      {children}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}

export default memo(MessageContainer);
