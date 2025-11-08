'use client';

import React, { memo } from 'react';

import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';
import { useGetWritingSessionsQuery } from '@/services/writing-session';

import { Loader2, Sparkles } from 'lucide-react';

import CreateSessionSection from './CreateSessionSection';
import SessionCard from './SessionCard';

interface RecentSessionsProps {
  selectedTopic?: WritingSessionCreateSchema;
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ selectedTopic }) => {
  const { data, isLoading } = useGetWritingSessionsQuery({ page: 1, size: 99 });

  const sessions = data?.items || [];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        <CreateSessionSection selectedTopic={selectedTopic} />
      </div>
      <div className="col-span-12 space-y-4 lg:col-span-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary mx-auto mb-4 size-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Đang tải phiên học...</p>
          </div>
        )}
        {sessions.length === 0 ? (
          <div className="border-muted-foreground/25 bg-muted/30 rounded-lg border-2 border-dashed p-12 text-center">
            <Sparkles className="text-primary mx-auto mb-4 size-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Bắt đầu hành trình học của bạn
            </h3>
            <p className="text-muted-foreground text-sm">
              Tự tạo chủ đề mới hoặc chọn một chủ đề bên ở khám phá để bắt đầu phiên viết đầu tiên
              của bạn!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RecentSessions);
