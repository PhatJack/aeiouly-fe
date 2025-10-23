'use client';

import React, { useCallback, useMemo } from 'react';
import Markdown from 'react-markdown';

import IndicatorLoading from '@/components/IndicatorLoading';
import { Button } from '@/components/ui/button';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { cn } from '@/lib/utils';

import { Languages, StopCircle, Volume2 } from 'lucide-react';

import MarkdownRender from '../MarkdownRender';

interface MessageItemProps {
  content: string;
  senderId?: number;
  index?: number;
  isLoading?: boolean;
  translationAvailable?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  content,
  senderId,
  index,
  isLoading = false,
  translationAvailable = true,
}) => {
  const { selectedVoice, voices, speaking, speak, cancel, speakingMessageId } = useSpeechContext();

  const messageId = `message-${index}`;
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
  }, [isThisMessageSpeaking, cancel, speak, content, selectedVoiceObject, messageId]);

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        senderId === 1 ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'w-fit max-w-sm rounded-lg p-3 break-words',
          senderId === 1
            ? 'bg-primary/85 self-end text-white'
            : 'self-start bg-gray-200 text-gray-800'
        )}
      >
        <div>
          {isLoading ? (
            <IndicatorLoading text={'Thinking'} />
          ) : (
            <MarkdownRender>{content}</MarkdownRender>
          )}
        </div>
      </div>
      {senderId === 2 && !isLoading && (
        <>
          <Button
            onClick={handleSpeakClick}
            type="button"
            size={'icon'}
            className={`size-7 rounded-full ${isThisMessageSpeaking ? 'bg-red-500 hover:bg-red-600' : ''}`}
            variant={'secondary'}
          >
            {isThisMessageSpeaking ? <StopCircle /> : <Volume2 />}
          </Button>
          {translationAvailable && (
            <Button
              // onClick={handleSpeakClick}
              type="button"
              size={'icon'}
              className={`size-7 rounded-full`}
              variant={'error'}
            >
              <Languages />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(MessageItem);
