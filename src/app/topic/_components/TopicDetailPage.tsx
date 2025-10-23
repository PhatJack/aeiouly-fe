'use client';

import React, { useEffect, useState } from 'react';

import Loading from '@/components/Loading';
import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { useGetChatHistoryQuery, useGetWritingSessionQuery } from '@/services/writing-session';

import ChatSection from './ChatSection';
import TopicInfoSection from './TopicInfoSection';

interface TopicDetailPageProps {
  id: string;
}

const TopicDetailPage = ({ id }: TopicDetailPageProps) => {
  const [messages, setMessages] = useState<ChatMessageResponseSchema[]>([]);

  const { data: writingSession } = useGetWritingSessionQuery(Number(id), {
    refetchOnWindowFocus: false,
  });

  const { data: sessionChatHistory } = useGetChatHistoryQuery(Number(id), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (sessionChatHistory) {
      setMessages(sessionChatHistory);
    }
  }, [sessionChatHistory]);

  if (!writingSession) {
    return (
      <div className="size-full relative">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col gap-6">
      <div className="flex min-h-0 flex-1 gap-6">
        {/* Left side - Chat */}
        <ChatSection sessionId={Number(id)} messages={messages} className="flex-1" />

        {/* Right side - Topic Details */}
        <TopicInfoSection writingSession={writingSession} />
      </div>
    </div>
  );
};

export default TopicDetailPage;
