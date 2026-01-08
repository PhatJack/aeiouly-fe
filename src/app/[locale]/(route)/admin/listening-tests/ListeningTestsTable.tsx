'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { getQueryClient } from '@/lib/get-query-client';
import CreateLessonForm from '@/components/app/listening/CreateLessonForm';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';
import { useDeleteLessonMutation, useGetLessonsQuery } from '@/services/listening-session';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import debounce from 'lodash.debounce';
import { Calendar, ExternalLink, Plus, Trash2, Youtube } from 'lucide-react';
import { toast } from 'sonner';

import { createColumns } from './columns';
import { DataTable } from './data-table';

const ListeningTestsTable = () => {
  const queryClient = getQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<LessonResponseSchema | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<LessonResponseSchema | null>(null);
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 10,
    search: searchParams.get('search') || '',
    level: searchParams.get('level') || undefined,
  });
  const [searchTerm, setSearchTerm] = useState(pagination.search);

  const { data } = useGetLessonsQuery(pagination);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPagination((prev) => ({ ...prev, search: searchValue, page: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    if (pagination.size !== 10) params.set('size', pagination.size.toString());
    if (pagination.search) params.set('search', pagination.search);
    if (pagination.level) params.set('level', pagination.level);
    if (params.toString() === searchParams.toString()) return;
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/admin/listening-tests${newUrl}`, { scroll: false });
  }, [pagination, router]);

  const deleteLessonMutation = useDeleteLessonMutation();

  const handleRowClick = (lesson: LessonResponseSchema) => {
    setSelectedLesson(lesson);
    setIsSheetOpen(true);
  };

  const handleDelete = (lesson: LessonResponseSchema) => {
    setLessonToDelete(lesson);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!lessonToDelete) return;

    deleteLessonMutation.mutate(lessonToDelete.id, {
      onSuccess: () => {
        toast.success('Xóa bài học thành công!');
        router.refresh();
        setDeleteDialogOpen(false);
        setLessonToDelete(null);
        if (selectedLesson?.id === lessonToDelete.id) {
          setIsSheetOpen(false);
          setSelectedLesson(null);
        }
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa bài học');
      },
    });
  };

  const columns = createColumns({
    onDelete: handleDelete,
  });

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1, // API uses 1-based pagination
      size: newPagination.pageSize,
    }));
  };

  const handleLevelChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      level: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý bài học nghe</h2>
          <p className="text-muted-foreground text-sm">Xem và quản lý tất cả bài học nghe</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo bài học mới
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        onRowClick={handleRowClick}
        pageCount={data?.total ? Math.ceil(data.total / pagination.size) : 0}
        pageIndex={pagination.page - 1} // Table uses 0-based pagination
        pageSize={pagination.size}
        onPaginationChange={handlePaginationChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        levelFilter={pagination.level || 'all'}
        onLevelChange={handleLevelChange}
      />

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedLesson && (
            <>
              <SheetHeader className="mt-5">
                <SheetTitle className="flex items-center justify-between">
                  <span>Chi tiết bài học #{selectedLesson.id}</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {selectedLesson.level}
                  </Badge>
                </SheetTitle>
                <SheetDescription>Xem và quản lý thông tin chi tiết của bài học</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-auto overflow-y-auto pb-4">
                <div className="space-y-4 px-4">
                  {/* Title */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Tiêu đề</h3>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm leading-relaxed">{selectedLesson.title}</p>
                    </div>
                  </div>

                  {/* YouTube URL */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <svg
                        className="size-4"
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>YouTube</title>
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube URL
                    </h3>
                    <div className="rounded-lg border p-4">
                      <a
                        href={selectedLesson.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedLesson.youtube_url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Thống kê</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <span className="text-xs">Tổng số câu</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold">{selectedLesson.total_sentences}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">Ngày tạo</span>
                        </div>
                        <p className="mt-2 text-sm font-medium">
                          {format(new Date(selectedLesson.created_at), 'dd/MM/yyyy', {
                            locale: vi,
                          })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(selectedLesson.created_at), 'HH:mm', { locale: vi })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="mb-3 text-sm font-semibold">Hành động</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(selectedLesson)}
                        disabled={deleteLessonMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Lesson Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo bài học nghe mới</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CreateLessonForm
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ['lessons'] });
              }}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bài học sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ListeningTestsTable;
