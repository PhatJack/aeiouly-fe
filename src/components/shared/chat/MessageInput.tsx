import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

  return (
    <Form {...messageForm}>
      <form
        onSubmit={messageForm.handleSubmit(onSubmit)}
        className="relative mt-auto flex w-full gap-2"
      >
        <FormField
          control={messageForm.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="w-full">
                <Input
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="border-border/50 focus-visible:ring-primary/50 h-14 rounded-full border-2 bg-white py-5 pr-14 pl-5 text-base shadow-none transition-all focus-visible:border-transparent focus-visible:ring-2"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          variant="default"
          disabled={disabled || !messageForm.watch('message')?.trim()}
          className="absolute top-1/2 right-2 size-10 -translate-y-1/2 rounded-full [&_svg:not([class*='size-'])]:size-5"
        >
          <ArrowUp />
        </Button>
      </form>
    </Form>
  );
};

export default MessageInput;
