'use client';

import React from 'react';

import ListeningSessionCard from '@/components/app/gym/ListeningSessionCard';
import { SessionResponseSchema } from '@/lib/schema/listening-session.schema';

import { Play } from 'lucide-react';

interface ListeningSessionsListProps {
  sessions: SessionResponseSchema[];
  onContinueSession: (sessionId: number) => void;
}

const ListeningSessionsList = ({ sessions, onContinueSession }: ListeningSessionsListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Play className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Chưa có phiên học nào</h3>
        <p className="text-muted-foreground">
          Bắt đầu học bằng cách chọn một bài học từ danh sách bên dưới
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {sessions.map((session) => {
        return (
          <ListeningSessionCard
            key={session.id}
            session={session}
            onContinueSession={onContinueSession}
          />
        );
      })}
    </div>
  );
};

export default ListeningSessionsList;
