'use client';

import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import CreateVocabularySetDialog from '@/components/app/vocabulary/CreateVocabularySetDialog';
import VocabularySetCard from '@/components/app/vocabulary/VocabularySetCard';
import AlertCustom from '@/components/custom/AlertCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { VocabularySetCreateSchema } from '@/lib/schema/vocabulary.schema';
import {
  useCreateVocabularySetMutation,
  useDeleteVocabularySetMutation,
  useGetAllVocabularySetsQuery,
  useUpdateVocabularySetMutation,
} from '@/services/vocabulary';

import { Binoculars, BookOpen, CircleAlert, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const VocabularyPage = () => {
  const router = useRouter();
  const t = useTranslations('vocabulary');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vocabularySetsData, isLoading } = useGetAllVocabularySetsQuery();
  const createSetMutation = useCreateVocabularySetMutation();
  const updateSetMutation = useUpdateVocabularySetMutation();
  const deleteSetMutation = useDeleteVocabularySetMutation();

  const handleCreateOrUpdate = (data: VocabularySetCreateSchema) => {
    createSetMutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('page.success.create'));
        setOpenCreateDialog(false);
      },
      onError: (error) => {
        toast.error(error.detail || t('page.error.create'));
      },
    });
  };

  const handleDelete = (setId: number) => {
    if (confirm(t('page.confirmDelete'))) {
      deleteSetMutation.mutate(setId, {
        onSuccess: () => {
          toast.success(t('page.success.delete'));
        },
        onError: (error) => {
          toast.error(error.detail || t('page.error.delete'));
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
          <h1 className="text-3xl font-bold">{t('page.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('page.description', { count: vocabularySetsData?.total || 0 })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('page.createNew')}
          </Button>
          <Button
            onClick={() => router.push('/vocabulary/find')}
            variant={'secondary'}
            className="gap-2"
          >
            <Binoculars className="h-4 w-4" />
            {t('page.findVocabulary')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder={t('page.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      <AlertCustom title={t('page.alertNote')} variant={'success'} icon={<CircleAlert />} />

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
          title={searchTerm ? t('page.empty.noResults') : t('page.empty.noSets')}
          description={searchTerm ? t('page.empty.noResultsDesc') : t('page.empty.noSetsDesc')}
          content={
            !searchTerm ? (
              <Button onClick={handleCreateNew} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('page.empty.createFirst')}
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
        <LoadingWithText text={t('page.loading')} className="fixed inset-0 z-50 bg-black/20" />
      )}
    </div>
  );
};

export default VocabularyPage;
