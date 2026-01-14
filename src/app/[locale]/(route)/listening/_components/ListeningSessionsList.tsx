'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';

import ListeningSessionCard from '@/components/app/gym/ListeningSessionCard';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { SessionResponseSchema } from '@/lib/schema/listening-session.schema';

import { Headset } from 'lucide-react';

interface ListeningSessionsListProps {
  sessions: SessionResponseSchema[];
  onContinueSession: (sessionId: number) => void;
  onDeleteLesson: (id: number) => void;
}

const ListeningSessionsList = ({
  sessions,
  onContinueSession,
  onDeleteLesson,
}: ListeningSessionsListProps) => {
  const t = useTranslations('listening');

  if (sessions.length === 0) {
    return (
      <EmptyCustom
        icon={<Headset className="h-12 w-12 text-blue-500" />}
        title={t('empty.noSessions')}
        description={t('empty.noSessionsDescription')}
      />
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
            onDeleteLesson={onDeleteLesson}
          />
        );
      })}
    </div>
  );
};

export default memo(ListeningSessionsList);
