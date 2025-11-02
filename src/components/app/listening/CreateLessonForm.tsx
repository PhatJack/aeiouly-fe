'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LessonCreateSchema, lessonCreateSchema } from '@/lib/schema/listening-session.schema';
import { useCreateLessonMutation } from '@/services/listening-session';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreateLessonFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateLessonForm = ({ onSuccess, onCancel }: CreateLessonFormProps) => {
  const createLessonMutation = useCreateLessonMutation();

  const form = useForm<LessonCreateSchema>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: '',
      youtube_url: '',
      srt_file: undefined,
    },
  });

  const onSubmit = (data: LessonCreateSchema) => {
    // Convert to FormData for file upload
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('youtube_url', data.youtube_url);
    formData.append('srt_file', data.srt_file);

    createLessonMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tạo bài học thành công!');
        form.reset();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Lỗi khi tạo bài học');
        console.error('Create lesson error:', error);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Tiêu đề bài học</FieldLabel>
            <Input
              {...field}
              placeholder="Nhập tiêu đề bài học..."
              disabled={createLessonMutation.isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="youtube_url"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>URL YouTube</FieldLabel>
            <Input
              {...field}
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={createLessonMutation.isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="srt_file"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>File SRT phụ đề</FieldLabel>
            <Input
              type="file"
              accept=".srt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
              }}
              disabled={createLessonMutation.isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <p className="text-muted-foreground mt-1 text-sm">
              Chọn file phụ đề .srt cho video YouTube
            </p>
          </Field>
        )}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createLessonMutation.isPending}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={createLessonMutation.isPending}>
          {createLessonMutation.isPending ? 'Đang tạo...' : 'Tạo bài học'}
        </Button>
      </div>
    </form>
  );
};

export default CreateLessonForm;
