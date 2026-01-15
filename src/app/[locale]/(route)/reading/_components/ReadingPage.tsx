'use client';

import React, { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import PageHeader from '@/components/PageHeader';
import ReadingSessionCard from '@/components/app/reading/ReadingSessionCard';
import EmptyCustom from '@/components/custom/EmptyCustom';
import PaginationCustom from '@/components/custom/PaginationCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE } from '@/configs/route';
import {
  useDeleteReadingSessionMutation,
  useGetReadingSessionsQuery,
} from '@/services/reading-session';

import { BookOpen, FileText } from 'lucide-react';
import { toast } from 'sonner';

import CreateSessionForm from './CreateSessionForm';

const ReadingPage = () => {
  const router = useRouter();
  const t = useTranslations('reading.page');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useGetReadingSessionsQuery({
    page,
    size: 10,
  });

  const deleteSessionMutation = useDeleteReadingSessionMutation();

  const handleCardClick = useCallback(
    (sessionId: number) => {
      router.push(`${ROUTE.READING}/${sessionId}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (sessionId: number) => {
      setDeletingId(sessionId);
      deleteSessionMutation.mutate(sessionId, {
        onSuccess: () => {
          toast.success(t('deleteSuccess'));
          refetch();
        },
        onError: () => {
          toast.error(t('deleteError'));
        },
        onSettled: () => {
          setDeletingId(null);
        },
      });
    },
    [deleteSessionMutation, refetch, t]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div className="h-full">
      <PageHeader
        title={t('title')}
        description={t('description')}
        icon="/sidebarIcon/reading.png"
        iconAlt="Reading icon"
        ringColor="ring-orange-600"
        stats={
          data
            ? [
                { label: t('stats.sessions'), value: data.total, isLive: true },
                { label: '', value: t('stats.levels') },
              ]
            : undefined
        }
      />

      {/* Content */}
      <div className="grid gap-4 py-4 lg:grid-cols-[1fr_400px]">
        {/* Left - Sessions List */}
        <div>
          {isLoading && (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 font-semibold">{t('error.title')}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{t('error.description')}</p>
                <Button onClick={() => refetch()}>{t('error.retry')}</Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && !isError && data && (
            <>
              {data.items.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-3">
                  {data.items.map((session, index) => (
                    <div key={`session-${index}`} className="size-full">
                      <ReadingSessionCard
                        session={session}
                        onClick={() => handleCardClick(session.id)}
                        onDelete={handleDelete}
                        isDeleting={deletingId === session.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCustom
                  icon={<FileText className="text-primary h-12 w-12" />}
                  title={t('empty.title')}
                  description={t('empty.description')}
                />
              )}

              {data.pages > 1 && (
                <PaginationCustom
                  currentPage={page}
                  totalPages={data.pages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Right - Create Session Form */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <CreateSessionForm onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;
