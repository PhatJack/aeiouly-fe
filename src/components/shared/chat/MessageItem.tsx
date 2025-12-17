'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';

import IndicatorLoading from '@/components/IndicatorLoading';
import { useCopyToClipboard } from '@/components/editor/tiptap-editor/hooks/use-copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { cn } from '@/lib/utils';

import { Check, Copy, Languages, Pause, Volume2 } from 'lucide-react';

import MarkdownRender from '../MarkdownRender';

interface MessageItemProps {
  content: string;
  senderRole?: 'user' | 'assistant';
  index?: number;
  isLoading?: boolean;
  disableTyping?: boolean;
  disableAssistantSpeak?: boolean;
  translation_sentence?: string;
  audioUrl?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  content,
  senderRole,
  isLoading = false,
  disableTyping = false,
  disableAssistantSpeak = false,
  translation_sentence = '',
  index = 0,
  audioUrl = '',
}) => {
  const messageId = `message-${index}`;
  const [isPlayAudio, setIsPlayAudio] = useState(false);
  const [isShowTranslated, setIsShowTranslated] = useState(false);
  const [hover, setHover] = useState(false);
  const { copy, isCopied } = useCopyToClipboard();
  const { selectedVoice, voices, speaking, speak, cancel, speakingMessageId } = useSpeechContext();
  const selectedVoiceObject = useMemo(
    () => voices.find((v) => v.name === selectedVoice),
    [voices, selectedVoice]
  );

  const isThisMessageSpeaking = speaking && speakingMessageId === messageId;

  const handleSpeakClick = useCallback(() => {
    if (isThisMessageSpeaking) {
      cancel();
    } else {
      speak({
        text: content,
        voice: selectedVoiceObject,
        messageId: messageId,
      });
    }
  }, [content]);

  return (
    <>
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
            'w-fit max-w-md px-4 py-2 break-words sm:max-w-lg',
            senderRole === 'user'
              ? 'bg-primary/85 dark:bg-primary self-end rounded-tl-2xl rounded-tr-sm rounded-b-2xl text-white'
              : 'dark:bg-muted self-start rounded-tl-sm rounded-tr-2xl rounded-b-2xl bg-gray-200 text-gray-800 dark:text-gray-200'
          )}
        >
          {isLoading ? (
            <IndicatorLoading text={content ? content : 'Đang suy nghĩ...'} />
          ) : senderRole === 'user' ? (
            content
          ) : (
            <MarkdownRender interval={50} disableTyping={disableTyping}>
              {content}
            </MarkdownRender>
          )}
          {isShowTranslated && translation_sentence && (
            <div className={cn('mt-2 w-full')}>
              <strong>Bản dịch:</strong>
              <p className="mt-1">{translation_sentence}</p>
            </div>
          )}
        </div>
        {senderRole === 'assistant' && !disableAssistantSpeak && !isLoading && (
          <Button
            onClick={() => handleSpeakClick()}
            type="button"
            size="icon"
            variant={isThisMessageSpeaking ? 'destructive' : 'warning'}
            className={cn(
              `size-7 rounded-full transition-all duration-200`,
              'order-1',
              hover ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
            )}
          >
            {isThisMessageSpeaking ? <Pause /> : <Volume2 />}
          </Button>
        )}
        {/* Copy button – chỉ hiện khi hover */}
        {!isLoading && (
          <Button
            onClick={() => copy(content)}
            type="button"
            size="icon"
            data-copied={isCopied}
            variant="secondary"
            className={cn(
              `size-7 rounded-full transition-all duration-200`,
              senderRole === 'user' ? '-order-1' : 'order-1',
              hover ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
            )}
          >
            {isCopied ? (
              <Check className="animate-in zoom-in-25 data-[copied=true]:animate-out data-[copied=true]:zoom-out" />
            ) : (
              <Copy className="animate-in zoom-in-25" />
            )}
          </Button>
        )}
        {senderRole === 'user' && audioUrl && (
          <>
            <Button
              onClick={() => setIsPlayAudio(!isPlayAudio)}
              type="button"
              size="icon"
              variant={isThisMessageSpeaking ? 'destructive' : 'warning'}
              className={cn(
                `size-7 rounded-full transition-all duration-200`,
                '-order-1',
                hover ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
              )}
            >
              {isThisMessageSpeaking ? <Pause /> : <Volume2 />}
            </Button>
            {isPlayAudio && (
              <audio
                src={audioUrl}
                autoPlay
                onEnded={() => setIsPlayAudio(false)}
                className="sr-only"
              />
            )}
          </>
        )}
        {translation_sentence && (
          <Button
            onClick={() => setIsShowTranslated(!isShowTranslated)}
            type="button"
            size="icon"
            variant={isShowTranslated ? 'default' : 'destructive'}
            className={cn(
              `size-7 rounded-full transition-all duration-200`,
              senderRole === 'user' ? '-order-1' : 'order-1',
              hover ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
            )}
          >
            <Languages />
          </Button>
        )}
      </div>
    </>
  );
};

export default memo(MessageItem);
