'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BackgroundVideoResponseSchema } from '@/lib/schema/background-video.schema';
import {
  useDeleteBackgroundVideoMutation,
  useGetAllBackgroundVideosQuery,
} from '@/services/background-videos';
import { useQueryClient } from '@tanstack/react-query';

import debounce from 'lodash.debounce';
import { Image, Plus, Youtube } from 'lucide-react';
import { toast } from 'sonner';

import CreateBackgroundVideoForm from './CreateBackgroundVideoForm';
import { createBackgroundVideoColumns } from './columns';
import { DataTable } from './data-table';

const BackgroundVideosTable = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<BackgroundVideoResponseSchema | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, search: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useGetAllBackgroundVideosQuery({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    search: pagination.search,
  });

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPagination((prev) => ({ ...prev, search: searchValue, pageIndex: 0 }));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);
  const deleteVideoMutation = useDeleteBackgroundVideoMutation();

  const handleRowClick = (video: BackgroundVideoResponseSchema) => {
    router.push(`/admin/spaces/videos/${video.id}`);
  };

  const handleDelete = (video: BackgroundVideoResponseSchema) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!videoToDelete) return;

    deleteVideoMutation.mutate(videoToDelete.id, {
      onSuccess: () => {
        toast.success('Video nền đã được xóa thành công');
        queryClient.invalidateQueries({ queryKey: ['background-videos'] });
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
      },
      onError: (error) => {
        toast.error('Không thể xóa video nền');
        console.error('Delete background video error:', error);
      },
    });
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['background-videos'] });
  };

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  };

  const columns = createBackgroundVideoColumns({
    onDelete: handleDelete,
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Video nền</h2>
          <p className="text-muted-foreground">Quản lý video YouTube cho nền học tập độc lập</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm video
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pageCount={data?.total ? Math.ceil(data.total / pagination.pageSize) : 0}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={handlePaginationChange}
        onRowClick={handleRowClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo video nền</DialogTitle>
          </DialogHeader>
          <CreateBackgroundVideoForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa video nền</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa video nền này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BackgroundVideosTable;
