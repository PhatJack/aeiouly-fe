import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { ArrowUp } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

interface MessageFormData {
  message: string;
}

const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Nhập tin nhắn...',
}: MessageInputProps) => {
  const messageForm = useForm<MessageFormData>({
    defaultValues: {
      message: '',
    },
  });

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
    (messageForm.watch('message') || '').split('\n').length > 1 ||
    (messageForm.watch('message') || '').length > 90;

  return (
    <Form {...messageForm}>
      <form
        onSubmit={messageForm.handleSubmit(onSubmit)}
        className={cn(
          `relative mt-auto grid w-full grid-cols-12 gap-2 border-2 bg-white dark:bg-transparent`,
          isMultiline ? 'rounded-xl p-4' : 'rounded-full'
        )}
      >
        <FormField
          control={messageForm.control}
          name="message"
          render={({ field }) => (
            <FormItem className={cn(isMultiline ? 'col-span-12' : 'col-span-11', 'transition-all')}>
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
                    `min-h-14 resize-none border-none shadow-none transition-all focus-visible:border-transparent focus-visible:ring-0 md:text-base dark:bg-transparent`,
                    isMultiline ? 'p-0' : 'p-4'
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Send Button */}
        <div
          className={cn(
            'flex items-center transition-all',
            isMultiline ? 'col-span-12 justify-end' : 'col-span-1 justify-center'
          )}
        >
          <Button
            type="submit"
            size="icon"
            variant="default"
            disabled={disabled || !messageForm.watch('message')?.trim()}
            className={`size-10 rounded-full [&_svg:not([class*='size-'])]:size-5`}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageInput;
