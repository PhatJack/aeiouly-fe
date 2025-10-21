'use client';

import React, { useState } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

import StarRating from '@/components/app/topic/StarRating';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import MessageItem from '@/components/shared/chat/MessageItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { ArrowUp, Mic, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface TopicDetailPageProps {
  slug: string;
}

const TopicDetailPage = ({ slug }: TopicDetailPageProps) => {
  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      setNewMessage((prev) => prev + ' ' + result);
      // setNewMessage(typeof result === 'string' ? (prev) => prev + " " + result : '');
    },
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello, how can I assist you with the topic today?',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
    {
      id: 2,
      text: 'Hi! Can you explain what React hooks are?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: 3,
      text: 'Sure! React hooks are functions that let you use state and other React features without writing a class. The most common ones are useState and useEffect.',
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: 4,
      text: 'Oh nice. Can I use multiple useEffects in one component?',
      isUser: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: 5,
      text: "Let's see. The bus picks us up at 8:30 am,",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
    {
      id: 6,
      text: 'Cool, thanks! That clears things up. 😊',
      isUser: true,
      timestamp: new Date(),
    },
    {
      id: 7,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true, // 👈 then replace later
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: `I have received your message about the topic "${decodeURIComponent(slug)}". I will help you learn more about this topic.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col gap-6">
      <div className="flex min-h-0 flex-1 gap-6">
        {/* Left side - Chat */}
        <div className="border-border/50 flex flex-1 flex-col rounded-2xl border bg-gray-50 p-6">
          <div className="scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent mb-6 flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.isUser ? 'justify-end' : 'justify-start')}
              >
                <MessageItem
                  content={message.text}
                  senderId={message.isUser ? 1 : 2}
                  index={message.id - 1}
                  isLoading={message.isLoading}
                />
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
            <div className="relative flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="border-border/50 focus-visible:ring-primary/50 h-14 rounded-full border-2 bg-white py-5 pr-14 pl-5 text-base shadow-none transition-all focus-visible:border-transparent focus-visible:ring-2"
              />
              <Button
                type="button"
                size={'icon'}
                variant={listening ? 'destructive' : 'ghost'}
                onClick={() => {
                  if (!listening) {
                    listen({
                      lang: 'en-US',
                    });
                  } else {
                    stop();
                  }
                }}
                className="absolute top-1/2 right-14 size-10 -translate-y-1/2 rounded-full [&_svg:not([class*='size-'])]:size-5"
              >
                <Mic />
              </Button>
              <Button
                type="submit"
                size="icon"
                variant={'default'}
                className="absolute top-1/2 right-3 size-10 -translate-y-1/2 rounded-full [&_svg:not([class*='size-'])]:size-5"
              >
                <ArrowUp size={20} />
              </Button>
            </div>
          </form>
        </div>

        {/* Right side - Topic Details */}
        <div className="border-border/50 flex w-md flex-col rounded-2xl border bg-gray-50 p-6 backdrop-blur-sm">
          <h2 className="from-secondary to-primary mb-6 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
            Thông tin chủ đề
          </h2>

          <div className="mb-6 space-y-6">
            <BlockquoteCustom title="Chủ đề" content={decodeURIComponent(slug)} />
            <BlockquoteCustom
              title="Độ khó"
              variants="info"
              content={
                <div className="flex items-center gap-3">
                  <StarRating rating={3} />
                  <span className="text-foreground text-sm font-medium">Trung bình</span>
                </div>
              }
            />
            <BlockquoteCustom title="Mô tả" content="15 phút" variants="warning" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
