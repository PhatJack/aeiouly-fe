'use client';

import React, { useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import ReadingSessionCard from '@/components/app/reading/ReadingSessionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetReadingSessionsQuery } from '@/services/reading-session';

import { BookOpen, FileText, Sparkles } from 'lucide-react';

import CreateSessionForm from './CreateSessionForm';

const ReadingPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetReadingSessionsQuery({
    page,
    size: 10,
  });

  const handleSessionSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCardClick = useCallback(
    (sessionId: number) => {
      router.push(`/reading/${sessionId}`);
    },
    [router]
  );

  const handlePreviousPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => (data ? Math.min(data.pages, p + 1) : p));
  }, [data]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="py-6">
          <div className="mb-6 flex items-start gap-5">
            <div className="group relative">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl ring-2 ring-orange-600">
                <div className="relative size-10">
                  <Image src={'/sidebarIcon/reading.png'} alt="Reading icon" fill quality={100} />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl leading-snug font-bold tracking-tight text-transparent">
                Luyện Đọc
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                Cải thiện kỹ năng đọc hiểu tiếng Anh qua các bài đọc đa dạng hoặc văn bản tự chọn
              </p>

              {data && (
                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      <span className="text-foreground font-semibold">{data.total}</span> phiên đọc
                    </span>
                  </div>
                  <div className="bg-border h-4 w-px" />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      Cấp độ <span className="text-foreground font-semibold">A1 - C2</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 py-6 lg:grid-cols-[1fr_400px]">
        {/* Left - Sessions List */}
        <div>
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
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
                <div className="space-y-4">
                  {data.items.map((session, index) => (
                    <div key={`session-${index}`} className="size-full">
                      <ReadingSessionCard
                        session={session}
                        onClick={() => handleCardClick(session.session_id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 font-semibold">Chưa có phiên đọc nào</h3>
                    <p className="text-muted-foreground text-sm">
                      Tạo phiên đọc đầu tiên của bạn để bắt đầu luyện tập
                    </p>
                  </CardContent>
                </Card>
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
