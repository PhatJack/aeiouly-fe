'use client';

import React, { memo } from 'react';

import IndicatorLoading from '@/components/IndicatorLoading';
import { useCopyToClipboard } from '@/components/editor/tiptap-editor/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Check, Copy } from 'lucide-react';

import MarkdownRender from '../MarkdownRender';

interface MessageItemProps {
  content: string;
  senderRole?: 'user' | 'assistant';
  index?: number;
  isLoading?: boolean;
  disableTyping?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  content,
  senderRole,
  index,
  isLoading = false,
  disableTyping = false,
}) => {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        senderRole === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'w-fit max-w-sm rounded-lg p-3 break-words',
          senderRole === 'user'
            ? 'bg-primary/85 dark:bg-primary self-end text-white'
            : 'dark:bg-muted self-start bg-gray-200 text-gray-800 dark:text-gray-200'
        )}
      >
        <div>
          {isLoading ? (
            <IndicatorLoading text={'Đang suy nghĩ...'} />
          ) : senderRole === 'user' ? (
            content
          ) : (
            <MarkdownRender disableTyping={disableTyping}>{content}</MarkdownRender>
          )}
        </div>
      </div>
      <Button
        onClick={() => copy(content)}
        type="button"
        size={'icon'}
        className={cn(`size-7 rounded-full`, senderRole === 'user' ? '-order-1' : 'order-1')}
        variant={'secondary'}
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default memo(MessageItem);
