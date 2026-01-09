'use client';

import React, { useCallback, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import PageHeader from '@/components/PageHeader';
import ReadingSessionCard from '@/components/app/reading/ReadingSessionCard';
import EmptyCustom from '@/components/custom/EmptyCustom';
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
          toast.success('Đã xóa phiên đọc thành công!');
          refetch();
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi xóa phiên đọc.');
        },
        onSettled: () => {
          setDeletingId(null);
        },
      });
    },
    [deleteSessionMutation, refetch]
  );

  const handlePreviousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => (data ? Math.min(data.pages, p + 1) : p));
  }, [data]);

  return (
    <div className="h-full">
      <PageHeader
        title="Luyện Đọc"
        description="Cải thiện kỹ năng đọc hiểu tiếng Anh qua các bài đọc đa dạng hoặc văn bản tự chọn"
        icon="/sidebarIcon/reading.png"
        iconAlt="Reading icon"
        ringColor="ring-orange-600"
        stats={
          data
            ? [
                { label: 'phiên đọc', value: data.total, isLive: true },
                { label: '', value: 'Cấp độ A1 - C2' },
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
                <h3 className="mb-2 font-semibold">Không thể tải dữ liệu</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Đã xảy ra lỗi khi tải danh sách phiên đọc
                </p>
                <Button onClick={() => refetch()}>Thử lại</Button>
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
                  title="Chưa có phiên đọc nào"
                  description="Tạo phiên đọc đầu tiên của bạn để bắt đầu luyện tập"
                />
              )}

              {data.pages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={handlePreviousPage} disabled={page === 1}>
                    Trang trước
                  </Button>
                  <span className="text-muted-foreground flex items-center px-4 text-sm">
                    Trang {page} / {data.pages}
                  </span>
                  <Button variant="outline" onClick={handleNextPage} disabled={page === data.pages}>
                    Trang sau
                  </Button>
                </div>
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
