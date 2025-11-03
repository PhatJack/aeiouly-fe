'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  BackgroundVideoTypeCreateSchema,
  backgroundVideoTypeCreateSchema,
} from '@/lib/schema/background-video.schema';
import { useCreateBackgroundVideoTypeMutation } from '@/services/background-video-types';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreateBackgroundVideoTypeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateBackgroundVideoTypeForm = ({
  onSuccess,
  onCancel,
}: CreateBackgroundVideoTypeFormProps) => {
  const createTypeMutation = useCreateBackgroundVideoTypeMutation();

  const form = useForm<BackgroundVideoTypeCreateSchema>({
    resolver: zodResolver(backgroundVideoTypeCreateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: BackgroundVideoTypeCreateSchema) => {
    createTypeMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Loại video đã được tạo thành công!');
        form.reset();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Không thể tạo loại video');
        console.error('Create video type error:', error);
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Tên loại</FieldLabel>
            <Input
              {...field}
              placeholder="Nhập tên loại video..."
              disabled={createTypeMutation.isPending}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Mô tả (tùy chọn)</FieldLabel>
            <Textarea
              {...field}
              placeholder="Nhập mô tả..."
              disabled={createTypeMutation.isPending}
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createTypeMutation.isPending}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={createTypeMutation.isPending}>
          {createTypeMutation.isPending ? 'Đang tạo...' : 'Tạo loại'}
        </Button>
      </div>
    </form>
  );
};

export default CreateBackgroundVideoTypeForm;
