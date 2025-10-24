'use client';

import React, { useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import ListeningLessonCard from '@/components/app/gym/ListeningLessonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLessonsQuery } from '@/services/listening-session';

import { Filter, Headphones, Search, Sparkles } from 'lucide-react';

const GymPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetLessonsQuery({
    page,
    size: 10,
    level: level == 'all' ? undefined : level,
    search: search || undefined,
  });

  const handleLessonClick = (lessonId: number) => {
    router.push(`/gym/${lessonId}`);
  };

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="py-6">
          <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-5">
              <div className="group relative">
                <div className="from-primary/10 to-primary/5 ring-primary/10 group-hover:ring-primary/20 relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <Headphones className="text-primary h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
                  <Sparkles className="text-primary absolute -top-2 -right-2 h-5 w-5" />
                </div>
              </div>

              {/* Title and Description */}
              <div className="flex-1 space-y-2">
                <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                  Luyện Nghe
                </h1>
                <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                  Nâng cao khả năng nghe hiểu tiếng Anh qua các bài học chất lượng cao từ YouTube
                  với phụ đề song ngữ
                </p>

                {/* Stats */}
                {data && (
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      <span className="text-muted-foreground">
                        <span className="text-foreground font-semibold">{data.total}</span> bài học
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

          {/* Search & Filter Section */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="group relative flex-1">
              <div className="from-primary/0 via-primary/5 to-primary/0 pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
              <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                placeholder="Tìm kiếm bài học theo tiêu đề hoặc chủ đề..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pr-4 pl-11 transition-all duration-200"
              />
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full shadow-sm transition-all duration-200 data-[size=default]:h-12 sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tất cả cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                <SelectItem value="A1">A1 - Sơ cấp</SelectItem>
                <SelectItem value="A2">A2 - Tiền trung cấp</SelectItem>
                <SelectItem value="B1">B1 - Trung cấp</SelectItem>
                <SelectItem value="B2">B2 - Trung cấp cao</SelectItem>
                <SelectItem value="C1">C1 - Nâng cao</SelectItem>
                <SelectItem value="C2">C2 - Thành thạo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="grid space-y-4 lg:col-span-2 lg:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-xl border p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-12 text-center">
            <div className="bg-destructive/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <Headphones className="text-destructive h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">Không thể tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">
              Đã xảy ra lỗi khi tải danh sách bài học. Vui lòng thử lại sau.
            </p>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </div>
        )}

        {/* Lessons List */}
        {!isLoading && !isError && data && (
          <>
            {data.items.length > 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                {data.items.map((lesson) => (
                  <ListeningLessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => handleLessonClick(lesson.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trang trước
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Trang {page} / {data.pages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={page === data.pages}
                >
                  Trang sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GymPage;
