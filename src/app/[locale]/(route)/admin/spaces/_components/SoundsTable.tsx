'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { getQueryClient } from '@/app/get-query-client';
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
import { SoundResponseSchema } from '@/lib/schema/sound.schema';
import { useDeleteSoundMutation, useGetAllSoundsQuery } from '@/services/sounds';

import debounce from 'lodash.debounce';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

import CreateSoundForm from './CreateSoundForm';
import { createColumns } from './columns';
import { DataTable } from './data-table';

const SoundsTable = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [soundToDelete, setSoundToDelete] = useState<SoundResponseSchema | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, search: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useGetAllSoundsQuery({
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
  const deleteSoundMutation = useDeleteSoundMutation();

  const handleRowClick = (sound: SoundResponseSchema) => {
    router.push(`/admin/spaces/sounds/${sound.id}`);
  };

  const handleDelete = (sound: SoundResponseSchema) => {
    setSoundToDelete(sound);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!soundToDelete) return;

    deleteSoundMutation.mutate(soundToDelete.id, {
      onSuccess: () => {
        toast.success('Âm thanh đã được xóa thành công');
        queryClient.invalidateQueries({ queryKey: ['sounds'] });
        setDeleteDialogOpen(false);
        setSoundToDelete(null);
      },
      onError: (error) => {
        toast.error('Không thể xóa âm thanh');
        console.error('Delete sound error:', error);
      },
    });
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['sounds'] });
  };

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  };

  const columns = createColumns({
    onDelete: handleDelete,
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Âm thanh</h2>
          <p className="text-muted-foreground">Quản lý các file âm thanh cho các phiên học solo</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm âm thanh
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
            <DialogTitle>Tạo âm thanh mới</DialogTitle>
          </DialogHeader>
          <CreateSoundForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa âm thanh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{soundToDelete?.name}&quot;? Hành động này không thể
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

export default SoundsTable;
