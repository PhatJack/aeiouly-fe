'use client';

import React, { useState } from 'react';

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
import { BackgroundVideoTypeResponseSchema } from '@/lib/schema/background-video.schema';
import {
  useDeleteBackgroundVideoTypeMutation,
  useGetAllBackgroundVideoTypesQuery,
} from '@/services/background-video-types';
import { useQueryClient } from '@tanstack/react-query';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import CreateBackgroundVideoTypeForm from './CreateBackgroundVideoTypeForm';
import { createBackgroundVideoTypeColumns } from './columns';
import { DataTable } from './data-table';

const BackgroundVideoTypesTable = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<BackgroundVideoTypeResponseSchema | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useGetAllBackgroundVideoTypesQuery({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
  });
  const deleteTypeMutation = useDeleteBackgroundVideoTypeMutation();

  const handleRowClick = (type: BackgroundVideoTypeResponseSchema) => {
    router.push(`/admin/spaces/types/${type.id}`);
  };

  const handleDelete = (type: BackgroundVideoTypeResponseSchema) => {
    setTypeToDelete(type);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!typeToDelete) return;

    deleteTypeMutation.mutate(typeToDelete.id, {
      onSuccess: () => {
        toast.success('Loại video đã được xóa thành công');
        queryClient.invalidateQueries({ queryKey: ['background-video-types'] });
        setDeleteDialogOpen(false);
        setTypeToDelete(null);
      },
      onError: (error) => {
        toast.error('Không thể xóa loại video');
        console.error('Delete video type error:', error);
      },
    });
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['background-video-types'] });
  };

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination({
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    });
  };

  const columns = createBackgroundVideoTypeColumns({
    onDelete: handleDelete,
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Loại video</h2>
          <p className="text-muted-foreground">Quản lý danh mục cho video nền</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại
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
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo loại video</DialogTitle>
          </DialogHeader>
          <CreateBackgroundVideoTypeForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa loại video</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{typeToDelete?.name}&quot;? Hành động này không thể
              hoàn tác.
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

export default BackgroundVideoTypesTable;
