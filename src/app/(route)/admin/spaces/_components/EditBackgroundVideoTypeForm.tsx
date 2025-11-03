'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTE } from '@/configs/route';
import {
  BackgroundVideoTypeUpdateSchema,
  backgroundVideoTypeUpdateSchema,
} from '@/lib/schema/background-video.schema';
import {
  useGetBackgroundVideoTypeQuery,
  useUpdateBackgroundVideoTypeMutation,
} from '@/services/background-video-types';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface EditBackgroundVideoTypeFormProps {
  typeId: number;
}

const EditBackgroundVideoTypeForm = ({ typeId }: EditBackgroundVideoTypeFormProps) => {
  const router = useRouter();
  const { data: videoType, isLoading } = useGetBackgroundVideoTypeQuery(typeId);
  const updateTypeMutation = useUpdateBackgroundVideoTypeMutation();

  const form = useForm<BackgroundVideoTypeUpdateSchema>({
    resolver: zodResolver(backgroundVideoTypeUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (videoType) {
      form.reset({
        name: videoType.name,
        description: videoType.description || '',
      });
    }
  }, [videoType, form]);

  const onSubmit = async (data: BackgroundVideoTypeUpdateSchema) => {
    try {
      await updateTypeMutation.mutateAsync({ typeId, data });
      toast.success('Loại video đã được cập nhật thành công!');
    } catch (error) {
      toast.error('Không thể cập nhật loại video');
      console.error('Update video type error:', error);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!videoType) {
    return <div>Không tìm thấy loại video</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Tên loại</FieldLabel>
            <Input
              {...field}
              placeholder="Nhập tên loại video..."
              disabled={updateTypeMutation.isPending}
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
              disabled={updateTypeMutation.isPending}
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
          onClick={() => router.push(ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX)}
          disabled={updateTypeMutation.isPending}
        >
          Quay lại danh sách
        </Button>
        <Button type="submit" disabled={updateTypeMutation.isPending}>
          {updateTypeMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật loại'}
        </Button>
      </div>
    </form>
  );
};

export default EditBackgroundVideoTypeForm;
