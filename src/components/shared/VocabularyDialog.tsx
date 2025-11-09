'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

import {
  VocabularyItemCreateSchema,
  VocabularySetCreateSchema,
  vocabularyItemCreateSchema,
  vocabularySetCreateSchema,
} from '@/lib/schema/vocabulary.schema';
import { useFindWordWithSuffixesQuery } from '@/services/dictionary/find-word-with-suffixes.api';
import { useAddVocabularyItemMutation } from '@/services/vocabulary/add-vocabulary-item.api';
import { useCreateVocabularySetMutation } from '@/services/vocabulary/create-vocabulary-set.api';
import { useGetAllVocabularySetsQuery } from '@/services/vocabulary/get-all-vocabulary-sets.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { Plus, X } from 'lucide-react';
import remarkBreaks from 'remark-breaks';
import { toast } from 'sonner';

import LoadingWithText from '../LoadingWithText';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface VocabularyDialogProps {
  textSelection: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const VocabularyDialog = ({ textSelection, open, onOpenChange }: VocabularyDialogProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const form = useForm<VocabularyItemCreateSchema>({
    defaultValues: {
      use_default_set: true,
      vocabulary_set_id: undefined,
      dictionary_id: undefined,
    },
    resolver: zodResolver(vocabularyItemCreateSchema),
  });

  const createSetForm = useForm<VocabularySetCreateSchema>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(vocabularySetCreateSchema),
  });

  const useDefaultSet = form.watch('use_default_set');
  const vocabularySetId = form.watch('vocabulary_set_id');

  const { data: vocabularySetsData, isLoading: isLoadingSets } = useGetAllVocabularySetsQuery();

  const {
    data: wordData,
    isLoading: isLoadingWord,
    isError: isWordError,
  } = useFindWordWithSuffixesQuery({ word: textSelection || '' }, !!textSelection && open === true);

  const addVocabularyMutation = useAddVocabularyItemMutation();
  const createSetMutation = useCreateVocabularySetMutation();

  useEffect(() => {
    if (wordData?.id) {
      form.setValue('dictionary_id', wordData.id);
    }
  }, [wordData, form]);

  // Handle vocabulary set selection
  const handleVocabularySetChange = (value: string) => {
    if (value === 'default') {
      form.setValue('use_default_set', true);
      form.setValue('vocabulary_set_id', undefined);
    } else {
      form.setValue('use_default_set', false);
      form.setValue('vocabulary_set_id', Number(value));
    }
  };

  const selectedValue = useMemo(() => {
    if (useDefaultSet) return 'default';
    return vocabularySetId?.toString() || 'default';
  }, [useDefaultSet, vocabularySetId]);

  const onSubmit = (data: VocabularyItemCreateSchema) => {
    if (!wordData?.id) {
      toast.error('Không tìm thấy từ vựng trong từ điển');
      return;
    }

    if (showCreateForm) {
      // Validate create set form
      createSetForm.handleSubmit(
        (validatedData) => {
          createSetMutation.mutate(validatedData, {
            onSuccess: (newSet) => {
              const vocabularyData: VocabularyItemCreateSchema = {
                ...data,
                use_default_set: false,
                vocabulary_set_id: newSet.id,
              };

              addVocabularyMutation.mutate(vocabularyData, {
                onSuccess: () => {
                  toast.success('Đã thêm từ vào bộ từ vựng mới!');
                  form.reset();
                  createSetForm.reset();
                  setShowCreateForm(false);
                  onOpenChange?.(false);
                },
                onError: (error: any) => {
                  toast.error(error.detail || 'Có lỗi xảy ra khi thêm từ vào danh sách');
                },
              });
            },
            onError: (error: any) => {
              toast.error(error.detail || 'Có lỗi xảy ra khi tạo bộ từ vựng');
            },
          });
        },
        () => {
          toast.error('Vui lòng điền đầy đủ thông tin bộ từ vựng');
        }
      )();
      return;
    }

    // Normal flow: just add vocabulary item
    addVocabularyMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Đã thêm từ vào danh sách thành công!');
        form.reset();
        onOpenChange?.(false);
      },
      onError: (error: any) => {
        toast.error(error.detail || 'Có lỗi xảy ra khi thêm từ vào danh sách');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Thêm từ mới vào danh sách</DialogTitle>
          <DialogDescription>
            Tìm hiểu và thêm từ &#34;<span className="font-semibold">{textSelection}</span>&#34; vào
            bộ từ vựng của bạn.
          </DialogDescription>
        </DialogHeader>
        <form id="form-add-vocabulary" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="vocabulary_set_id"
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FieldLabel>Bộ từ vựng</FieldLabel>
                    <Button
                      type="button"
                      variant={showCreateForm ? 'error-outline' : 'secondary-outline'}
                      onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                      {showCreateForm ? (
                        <>
                          <X className="h-3 w-3" />
                          <span>Đóng</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Tạo mới</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Select
                    name={field.name}
                    value={selectedValue}
                    onValueChange={handleVocabularySetChange}
                    disabled={isLoadingSets}
                  >
                    <SelectTrigger className="min-w-[150px]" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Chọn bộ từ vựng" />
                    </SelectTrigger>
                    <SelectContent
                      position="item-aligned"
                      // onScrollEnd={(e) => {
                      //   console.log(e);
                      // }}
                    >
                      <SelectItem value="default">Bộ từ mặc định</SelectItem>
                      {vocabularySetsData?.items
                        ?.filter((set) => !set.is_default)
                        .map((set) => (
                          <SelectItem key={set.id} value={set.id.toString()}>
                            {set.name} ({set.total_words} từ)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        {/* Create Vocabulary Set Form - Accordion Style */}
        {showCreateForm && (
          <div className="animate-in slide-in-from-top-2 rounded-lg border bg-white p-4">
            <h4 className="text-primary mb-3 text-sm font-semibold">Tạo bộ từ vựng mới</h4>
            <div className="space-y-3">
              <Controller
                control={createSetForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tên bộ từ vựng</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nhập tên bộ từ vựng"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={createSetForm.control}
                name="description"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Mô tả (tùy chọn)</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả cho bộ từ vựng"
                      rows={4}
                      className="resize-none"
                    />
                  </Field>
                )}
              />
            </div>
          </div>
        )}
        <div id="markdown-word">
          {isLoadingWord ? (
            <LoadingWithText text="Đang tìm định nghĩa từ..." />
          ) : isWordError || !wordData ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">
                Không tìm thấy từ &#34;<span className="font-semibold">{textSelection}</span>&#34;
                trong từ điển
              </p>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-md border p-4">
              <h4 className="mb-2 text-lg font-semibold">{wordData.expression}</h4>
              <div className="prose prose-sm max-w-none *:mb-0">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {wordData.definitions.replace(/\\n/g, '\n')}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="form-add-vocabulary"
            disabled={
              !wordData?.id || addVocabularyMutation.isPending || createSetMutation.isPending
            }
          >
            {showCreateForm ? 'Tạo và thêm từ' : 'Thêm từ'}
          </Button>
        </div>
        {addVocabularyMutation.isPending && (
          <LoadingWithText
            text="Đang thêm từ vựng..."
            className="fixed inset-0 size-full bg-gray-50 backdrop-blur-sm"
          />
        )}
        {createSetMutation.isPending && (
          <LoadingWithText
            text="Đang tạo bộ từ vựng..."
            className="fixed inset-0 size-full bg-gray-50 backdrop-blur-sm"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VocabularyDialog;
