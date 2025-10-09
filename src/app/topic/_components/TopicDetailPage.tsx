'use client';

import React, { useState } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

import StarRating from '@/components/app/topic/StarRating';
import MessageItem from '@/components/shared/chat/MessageItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Mic, Send } from 'lucide-react';

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
  const { speak } = useSpeechSynthesis();
  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      // setNewMessage(result.item?.[0]);
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
      text: 'Yes, absolutely! You can use as many useEffects as you need. Each one can handle different side effects separately.',
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
        <div className="bg-background/80 border-border/50 flex flex-1 flex-col rounded-2xl border p-6">
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
                className="border-border/50 focus-visible:ring-primary/50 h-14 border-2 bg-white px-14 py-5 text-base transition-all focus-visible:border-transparent focus-visible:ring-2"
              />
              <Button
                type="button"
                size={'icon'}
                variant="ghost"
                onClick={() => {
                  if (listening) {
                    listen({
                      lang: 'vi-VN',
                    });
                  } else {
                    stop();
                  }
                }}
                className="absolute top-1/2 left-3 -translate-y-1/2"
              >
                <Mic size={18} className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                size="icon"
                variant={'default'}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <Send size={18} className="-translate-x-0.5 transform" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right side - Topic Details */}
        <div className="bg-background/80 border-border/50 flex w-md flex-col rounded-2xl border p-6 backdrop-blur-sm">
          <h2 className="from-secondary to-primary mb-6 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
            Thông tin chủ đề
          </h2>

          <div className="mb-6 space-y-6">
            <div className="from-primary/20 to-secondary/20 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-1 text-xs font-medium">Chủ đề</h3>
              <p className="text-foreground text-lg font-semibold">{decodeURIComponent(slug)}</p>
            </div>

            <div className="from-primary/20 to-secondary/20 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-2 text-xs font-medium">Độ khó</h3>
              <div className="flex items-center gap-3">
                <StarRating rating={3} />
                <span className="text-foreground text-sm font-medium">Trung bình</span>
              </div>
            </div>

            <div className="from-primary/20 to-secondary/20 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-1 text-xs font-medium">Thời lượng</h3>
              <p className="text-foreground text-lg font-semibold">15 phút</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
