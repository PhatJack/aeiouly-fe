'use client';

import React, { useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import CreateVocabularySetDialog from '@/components/app/vocabulary/CreateVocabularySetDialog';
import VocabularySetCard from '@/components/app/vocabulary/VocabularySetCard';
import AlertCustom from '@/components/custom/AlertCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  VocabularySetCreateSchema,
  VocabularySetResponseSchema,
} from '@/lib/schema/vocabulary.schema';
import {
  useCreateVocabularySetMutation,
  useDeleteVocabularySetMutation,
  useGetAllVocabularySetsQuery,
  useUpdateVocabularySetMutation,
} from '@/services/vocabulary';

import { BookOpen, CircleAlert, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const VocabularyPage = () => {
  const router = useRouter();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vocabularySetsData, isLoading } = useGetAllVocabularySetsQuery();
  const createSetMutation = useCreateVocabularySetMutation();
  const updateSetMutation = useUpdateVocabularySetMutation();
  const deleteSetMutation = useDeleteVocabularySetMutation();

  const handleCreateOrUpdate = (data: VocabularySetCreateSchema) => {
    createSetMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Tạo bộ từ vựng mới thành công!');
        setOpenCreateDialog(false);
      },
      onError: (error) => {
        toast.error(error.detail || 'Có lỗi xảy ra khi tạo bộ từ vựng');
      },
    });
  };

  const handleDelete = (setId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bộ từ vựng này?')) {
      deleteSetMutation.mutate(setId, {
        onSuccess: () => {
          toast.success('Xóa bộ từ vựng thành công!');
        },
        onError: (error) => {
          toast.error(error.detail || 'Có lỗi xảy ra khi xóa bộ từ vựng');
        },
      });
    }
  };

  const handleView = (setId: number) => {
    router.push(`/vocabulary/${setId}`);
  };

  const handleCreateNew = () => {
    setOpenCreateDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bộ từ vựng của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và học tập với {vocabularySetsData?.total || 0} bộ từ vựng
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bộ từ mới
          </Button>
          <Button
            onClick={() => router.push('/vocabulary/find')}
            variant={'secondary'}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tìm kiếm từ vựng
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Tìm kiếm bộ từ vựng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      <AlertCustom
        title="Chú ý: Bạn có thể tạo flashcards từ highlights (bao gồm các highlights các bạn đã tạo trước đây) trong trang chi tiết luyện thi."
        variant={'success'}
        icon={<CircleAlert />}
      />

      {/* Vocabulary Sets Grid */}
      {vocabularySetsData && vocabularySetsData.items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vocabularySetsData.items.map((set) => (
            <VocabularySetCard
              key={set.id}
              vocabularySet={set}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <EmptyCustom
          icon={<BookOpen className="text-muted-foreground h-12 w-12" />}
          title={searchTerm ? 'Không tìm thấy bộ từ vựng' : 'Chưa có bộ từ vựng nào'}
          description={
            searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo bộ từ vựng đầu tiên để bắt đầu học'
          }
          content={
            !searchTerm ? (
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo bộ từ mới
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Create/Edit Dialog */}
      <CreateVocabularySetDialog
        open={openCreateDialog}
        onOpenChange={(open) => {
          setOpenCreateDialog(open);
        }}
        onSubmit={handleCreateOrUpdate}
        isPending={createSetMutation.isPending || updateSetMutation.isPending}
      />

      {/* Loading Overlays */}
      {deleteSetMutation.isPending && (
        <LoadingWithText text="Đang xóa..." className="fixed inset-0 z-50 bg-black/20" />
      )}
    </div>
  );
};

export default VocabularyPage;
