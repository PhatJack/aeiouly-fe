import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChatBodySchema } from '@/lib/schema/chat';

import { ArrowUp } from 'lucide-react';

const MessageInput = () => {
  const messageForm = useForm<ChatBodySchema>();

  const onSubmit = useCallback((data: ChatBodySchema) => {
    console.log(data);
  }, []);

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
                  placeholder="Nhập tin nhắn..."
                  className="border-border/50 focus-visible:ring-primary/50 border-2 bg-white py-5 pr-12 pl-4 text-base transition-all focus-visible:border-transparent focus-visible:ring-2"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          variant={'ghost'}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          <ArrowUp size={18} className="-translate-x-0.5 transform" />
        </Button>
      </form>
    </Form>
  );
};

export default MessageInput;
