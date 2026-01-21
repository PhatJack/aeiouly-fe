import React, { useCallback } from 'react';
import type { RefObject } from 'react';
import { useForm } from 'react-hook-form';

import { Visualizer } from '@/components/app/onion/Visualizer';
import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';

import { ArrowUp, Mic, Square } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  showAudioButton?: boolean; // toggle mic visibility
  isRecording?: boolean; // current recording state
  onAudioClick?: () => void; // handler to start/stop recording
  recorderStream?: MediaStream | null; // stream for visualizer
  mediaRecorderRef?: RefObject<MediaRecorder | null>; // media recorder ref
}

interface MessageFormData {
  message: string;
}

const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Nhập tin nhắn...',
  showAudioButton = false,
  isRecording = false,
  onAudioClick,
  recorderStream,
  mediaRecorderRef,
}: MessageInputProps) => {
  const messageForm = useForm<MessageFormData>({
    defaultValues: {
      message: '',
    },
  });

  const { width } = useWindowSize();

  const onSubmit = useCallback(
    (data: MessageFormData) => {
      if (data.message.trim() && !disabled) {
        onSendMessage(data.message);
        messageForm.reset();
      }
    },
    [onSendMessage, disabled, messageForm]
  );

  // Determine if textarea is multiline (more than 1 line)
  const isMultiline =
    (width ?? 0) < 640 ||
    (messageForm.watch('message') || '').split('\n').length > 1 ||
    (messageForm.watch('message') || '').length > 92;

  const renderAudioButton = showAudioButton && (
    <TooltipCustom content={'Gửi file giọng nói'} side="top">
      <Button
        type="button"
        size="icon"
        variant={isRecording ? 'destructive' : 'secondary'}
        onClick={onAudioClick}
        disabled={disabled}
        aria-label={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
        className={cn(
          'size-10 rounded-full transition-colors md:[&_svg:not([class*="size-"])]:size-7',
          isMultiline ? 'mt-1 self-start' : ''
        )}
      >
        {isRecording ? <Square /> : <Mic />}
      </Button>
    </TooltipCustom>
  );

  return (
    <Form {...messageForm}>
      <form
        onSubmit={messageForm.handleSubmit(onSubmit)}
        data-expand={isMultiline}
        className={cn(
          'group/composer relative mt-auto flex w-full items-center rounded-2xl border bg-white transition-all dark:bg-transparent'
        )}
      >
        <div
          className={cn(
            "grid w-full grid-cols-[auto_1fr_auto] p-2.5 [grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing'] sm:[grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.']",
            "group-data-[expand=true]/composer:[grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing']"
          )}
        >
          {/* Visualizer area – shows only while recording */}
          {isRecording && recorderStream && mediaRecorderRef && (
            <div className="mb-2 [grid-area:header]">
              <div className="dark:bg-muted h-16 w-full overflow-hidden rounded-xl border bg-gray-50">
                <Visualizer
                  stream={recorderStream}
                  isRecording={isRecording}
                  mediaRecorderRef={mediaRecorderRef}
                />
              </div>
            </div>
          )}
          <div className="[grid-area:leading]">{renderAudioButton}</div>
          <FormField
            control={messageForm.control}
            name="message"
            render={({ field }) => (
              <FormItem
                className={cn(
                  'mb-2 flex-1 pt-2 transition-all [grid-area:primary]',
                  'group-data-[expand=false]/composer:px-2.5'
                )}
              >
                <FormControl className="w-full">
                  <Textarea
                    {...field}
                    placeholder={placeholder}
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onSubmit({ message: field.value });
                      }
                    }}
                    className={cn(
                      'min-h-0 resize-none rounded-none border-none p-0 shadow-none transition-all focus-visible:border-transparent focus-visible:ring-0 md:text-base dark:bg-transparent'
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            variant="default"
            disabled={disabled || !messageForm.watch('message')?.trim()}
            className={cn(
              'size-10 rounded-full [grid-area:trailing] [&_svg:not([class*="size-"])]:size-5',
              isMultiline ? 'self-end' : ''
            )}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageInput;
