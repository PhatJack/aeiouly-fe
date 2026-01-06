'use client';

import React, { useCallback, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import PageHeader from '@/components/PageHeader';
import EmptyCustom from '@/components/custom/EmptyCustom';
import PaginationCustom from '@/components/custom/PaginationCustom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { ROUTE } from '@/configs/route';
import {
  useCreateListeningSessionMutation,
  useDeleteLessonMutation,
  useGetLessonsQuery,
  useGetListeningSessionsQuery,
} from '@/services/listening-session';

import { Filter, Headphones, Search } from 'lucide-react';
import { toast } from 'sonner';

import LessonsList from './LessonsList';
import ListeningSessionsList from './ListeningSessionsList';

const GymPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const createListeningSessionMutation = useCreateListeningSessionMutation();
  const { data: listeningSessions } = useGetListeningSessionsQuery();
  const deleteMutation = useDeleteLessonMutation();
  const { data, isLoading, isError, refetch } = useGetLessonsQuery({
    page,
    size: 12,
    level: level == 'all' ? undefined : level,
    search: search || undefined,
  });

  const handleLessonClick = (lessonId: number) => {
    toast.promise(createListeningSessionMutation.mutateAsync({ lesson_id: lessonId }), {
      loading: 'Đang tạo phiên luyện nghe...',
      success: (data) => {
        router.push(`${ROUTE.GYM}/${data.id}`);
        return 'Phiên luyện nghe đã được tạo!';
      },
      error: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
    });
  };

  const handleDeleteClick = useCallback((id: number) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (pendingDeleteId === null) return;

    toast.promise(deleteMutation.mutateAsync(pendingDeleteId), {
      loading: 'Đang xoá ...',
      success: () => {
        setPendingDeleteId(null);
        return 'Xoá phiên thành công!';
      },
      error: (e: any) => {
        setPendingDeleteId(null);
        return e?.detail || 'Xoá phiên thất bại. Vui lòng thử lại.';
      },
    });
  }, [deleteMutation, pendingDeleteId]);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Luyện Nghe"
        description="Nâng cao khả năng nghe hiểu tiếng Anh qua các bài học chất lượng cao từ YouTube với phụ đề song ngữ"
        icon="/sidebarIcon/headphone.png"
        iconAlt="Headphone icon"
        ringColor="ring-blue-600"
        stats={
          data
            ? [
                { label: 'bài học', value: data.total, isLive: true },
                { label: '', value: 'Cấp độ A1 - C2' },
              ]
            : undefined
        }
      />

      <div className="relative grid gap-4 py-4">
        <section className="space-y-4 xl:col-span-1">
          <h2 className="text-foreground text-xl font-bold">Tiếp tục học</h2>

          {/* My Sessions Content */}
          {listeningSessions ? (
            <ListeningSessionsList
              sessions={listeningSessions.items || []}
              onContinueSession={(sessionId) => router.push(`${ROUTE.GYM}/${sessionId}`)}
              onDeleteLesson={handleDeleteClick}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-foreground text-xl font-bold">Khám phá bài học</h2>
          {/* Search & Filter Section */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="group relative flex-1">
              <div className="from-primary/0 via-primary/5 to-primary/0 pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
              <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                placeholder="Tìm kiếm bài học theo tiêu đề hoặc chủ đề..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pr-4 pl-11 transition-all duration-200"
              />
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full shadow-sm transition-all duration-200 data-[size=default]:h-11 sm:w-[200px]">
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

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border p-4">
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
            <EmptyCustom
              icon={<Headphones className="text-muted-foreground h-12 w-12" />}
              title="Không thể tải dữ liệu"
              description="Đã xảy ra lỗi khi tải danh sách bài học. Vui lòng thử lại sau."
              content={<Button onClick={() => refetch()}>Thử lại</Button>}
            />
          )}

          {/* Lessons List */}
          {!isLoading && !isError && data && (
            <>
              {data.items.length > 0 && (
                <LessonsList lessons={data.items} onLessonClick={handleLessonClick} />
              )}

              {/* Pagination */}
              <PaginationCustom currentPage={page} totalPages={data.pages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phiên #{pendingDeleteId}?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. Phiên và dữ liệu liên quan sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GymPage;
