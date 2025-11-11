'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import LoadingWithText from '@/components/LoadingWithText';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  VocabularySetCreateSchema,
  VocabularySetResponseSchema,
  vocabularySetCreateSchema,
} from '@/lib/schema/vocabulary.schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateVocabularySetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VocabularySetCreateSchema) => void;
  editingSet?: VocabularySetResponseSchema | null;
  isPending?: boolean;
}

const CreateVocabularySetDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingSet,
  isPending,
}: CreateVocabularySetDialogProps) => {
  const form = useForm<VocabularySetCreateSchema>({
    defaultValues: {
      name: editingSet?.name || '',
      description: editingSet?.description || '',
    },
    resolver: zodResolver(vocabularySetCreateSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: editingSet?.name || '',
        description: editingSet?.description || '',
      });
    }
  }, [open, editingSet, form]);

  const handleSubmit = (data: VocabularySetCreateSchema) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSet ? 'Chỉnh sửa bộ từ vựng' : 'Tạo bộ từ vựng mới'}</DialogTitle>
          <DialogDescription>
            {editingSet
              ? 'Cập nhật thông tin bộ từ vựng của bạn'
              : 'Tạo một bộ từ vựng mới để quản lý từ của bạn'}
          </DialogDescription>
        </DialogHeader>

        <form id="form-vocabulary-set" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form-vocabulary-set-name">Tên bộ từ vựng</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập tên bộ từ vựng"
                    id="form-vocabulary-set-name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="form-vocabulary-set-description">
                    Mô tả (tùy chọn)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Nhập mô tả cho bộ từ vựng"
                    id="form-vocabulary-set-description"
                    rows={4}
                    className="resize-none"
                  />
                </Field>
              )}
            />
          </div>
        </form>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              form.reset();
            }}
          >
            Hủy
          </Button>
          <Button type="submit" form="form-vocabulary-set" disabled={isPending}>
            {editingSet ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
        {isPending && (
          <LoadingWithText
            text={editingSet ? 'Đang cập nhật...' : 'Đang tạo...'}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateVocabularySetDialog;
