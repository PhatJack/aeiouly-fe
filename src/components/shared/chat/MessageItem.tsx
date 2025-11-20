'use client';

import React, { memo, useState } from 'react';

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
  isLoading = false,
  disableTyping = false,
}) => {
  const [hover, setHover] = useState(false);
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div
      className={cn(
        'relative flex w-full items-center gap-2',
        senderRole === 'user' ? 'justify-end' : 'justify-start'
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          'w-fit max-w-md px-4 py-2 break-words',
          senderRole === 'user'
            ? 'bg-primary/85 dark:bg-primary self-end rounded-tl-2xl rounded-tr-sm rounded-b-2xl text-white'
            : 'dark:bg-muted self-start rounded-tl-sm rounded-tr-2xl rounded-b-2xl bg-gray-200 text-gray-800 dark:text-gray-200'
        )}
      >
        {isLoading ? (
          <IndicatorLoading text={'Đang suy nghĩ...'} />
        ) : senderRole === 'user' ? (
          content
        ) : (
          <MarkdownRender disableTyping={disableTyping}>{content}</MarkdownRender>
        )}
      </div>

      {/* Copy button – chỉ hiện khi hover */}
      <Button
        onClick={() => copy(content)}
        type="button"
        size="icon"
        variant="secondary"
        className={cn(
          `size-7 rounded-full transition-all duration-200`,
          senderRole === 'user' ? '-order-1' : 'order-1',
          hover ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
        )}
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default memo(MessageItem);
