'use client';

import React, { useState } from 'react';

import StarRating from '@/components/app/topic/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { BookOpen, MessageCircle, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface DetailPageProps {
  slug: string;
}

const DetailPage = ({ slug }: DetailPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);

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
        text: `Tôi đã nhận được tin nhắn của bạn về chủ đề "${slug}". Tôi sẽ giúp bạn tìm hiểu thêm về chủ đề này.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl border bg-white px-4 py-2 transition-all duration-200'
                  )}
                >
                  <p className="leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
            <div className="relative flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="border-border/50 focus-visible:ring-primary/50 border-2 py-5 pr-12 pl-4 text-base transition-all focus-visible:border-transparent focus-visible:ring-2"
              />
              <Button
                type="submit"
                size="icon"
                className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2 rounded-lg bg-gradient-to-br text-white"
              >
                <Send size={18} className="-translate-x-0.5 transform" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right side - Topic Details */}
        <div className="bg-background/80 border-border/50 flex w-sm flex-col rounded-2xl border p-6 backdrop-blur-sm">
          <h2 className="from-secondary to-primary mb-6 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
            Thông tin chủ đề
          </h2>

          <div className="mb-6 space-y-6">
            <div className="from-primary/5 to-secondary/5 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-1 text-xs font-medium">Chủ đề</h3>
              <p className="text-foreground text-lg font-semibold">{decodeURIComponent(slug)}</p>
            </div>

            <div className="from-primary/5 to-secondary/5 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-2 text-xs font-medium">Độ khó</h3>
              <div className="flex items-center gap-3">
                <StarRating rating={3} />
                <span className="text-foreground text-sm font-medium">Trung bình</span>
              </div>
            </div>

            <div className="from-primary/5 to-secondary/5 border-border/30 rounded-xl border bg-gradient-to-br p-4">
              <h3 className="text-muted-foreground mb-1 text-xs font-medium">Thời lượng</h3>
              <p className="text-foreground text-lg font-semibold">15 phút</p>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <Button
              variant="outline"
              className="text-foreground/90 hover:bg-primary/5 hover:border-primary/30 border-border/50 h-12 w-full justify-start gap-3 transition-all"
            >
              <MessageCircle size={18} className="text-primary" />
              Luyện hội thoại
            </Button>
            <Button
              variant="outline"
              className="text-foreground/90 hover:bg-secondary/5 hover:border-secondary/30 border-border/50 h-12 w-full justify-start gap-3 transition-all"
            >
              <BookOpen size={18} className="text-secondary" />
              Từ vựng liên quan
            </Button>
            <Button
              className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-12 w-full bg-gradient-to-r text-base font-medium shadow-md transition-all hover:shadow-lg"
              size="lg"
            >
              Bắt đầu học
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
