'use client';

import React from 'react';

import Loading from '@/components/Loading';
import LoadingWithText from '@/components/LoadingWithText';
import { useGetWritingSessionQuery } from '@/services/writing-session';

import ChatSection from './ChatSection';
import TopicInfoSection from './TopicInfoSection';

interface TopicDetailPageProps {
  id: string;
}

const TopicDetailPage = ({ id }: TopicDetailPageProps) => {
  const { data: writingSession, isLoading } = useGetWritingSessionQuery(Number(id), {
    refetchOnWindowFocus: false,
  });

  if (isLoading || !writingSession) {
    return <LoadingWithText text="Đang tải dữ liệu..." />;
  }

  return (
    <div className="flex flex-col gap-6 xl:h-[calc(100vh-2rem)]">
      <div className="flex min-h-0 flex-1 flex-col gap-6 xl:flex-row">
        {/* Left side - Chat */}
        <ChatSection sessionId={Number(id)} className="flex-1" />

        {/* Right side - Topic Details */}
        <TopicInfoSection writingSession={writingSession} />
      </div>
    </div>
  );
};

export default TopicDetailPage;
