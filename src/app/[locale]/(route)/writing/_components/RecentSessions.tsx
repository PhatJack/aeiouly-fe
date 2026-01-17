'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';
import {
  useDeleteWritingSessionMutation,
  useGetWritingSessionsQuery,
} from '@/services/writing-session';

import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import CreateSessionSection from './CreateSessionSection';
import SessionCard from './SessionCard';

interface RecentSessionsProps {
  selectedTopic?: WritingSessionCreateSchema;
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ selectedTopic }) => {
  const t = useTranslations('writing');
  const { data, isLoading } = useGetWritingSessionsQuery({ page: 1, size: 99 });

  const deleteMutation = useDeleteWritingSessionMutation();

  const sessions = data?.items || [];

  const handleDelete = (sessionId: number) => {
    deleteMutation.mutate(sessionId, {
      onSuccess: () => {
        toast.success(t('recentSessions.deleteSuccess'));
      },
      onError: () => {
        toast.error(t('recentSessions.deleteError'));
      },
    });
  };

  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="sticky top-0 col-span-12 h-full lg:col-span-4">
        <CreateSessionSection selectedTopic={selectedTopic} />
      </div>
      <div className="col-span-12 space-y-4 lg:col-span-8">
        {isLoading && <LoadingWithText text={t('recentSessions.loading')} />}
        {sessions.length === 0 ? (
          <EmptyCustom
            icon={<Sparkles className="h-12 w-12 text-violet-500" />}
            title={t('recentSessions.empty.title')}
            description={t('recentSessions.empty.description')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RecentSessions);
