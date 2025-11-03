'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BackgroundVideoCreateSchema,
  BackgroundVideoTypeResponseSchema,
  backgroundVideoCreateSchema,
} from '@/lib/schema/background-video.schema';
import { useGetAllBackgroundVideoTypesQuery } from '@/services/background-video-types';
import {
  useCreateBackgroundVideoMutation,
  useUploadBackgroundVideoImageMutation,
} from '@/services/background-videos';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreateBackgroundVideoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateBackgroundVideoForm = ({ onSuccess, onCancel }: CreateBackgroundVideoFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const createVideoMutation = useCreateBackgroundVideoMutation();
  const uploadImageMutation = useUploadBackgroundVideoImageMutation();
  const { data: typesData } = useGetAllBackgroundVideoTypesQuery({ page: 1, size: 100 });

  const form = useForm<BackgroundVideoCreateSchema>({
    resolver: zodResolver(backgroundVideoCreateSchema),
    defaultValues: {
      youtube_url: '',
      type_id: undefined,
    },
  });

  const onSubmit = async (data: BackgroundVideoCreateSchema) => {
    try {
      // Create the video first
      const video = await createVideoMutation.mutateAsync(data);

      // Then upload the image if selected
      if (selectedImage) {
        await uploadImageMutation.mutateAsync({
          videoId: video.id,
          imageFile: selectedImage,
        });
        toast.success('Video nền đã được tạo và hình ảnh đã được upload thành công!');
      } else {
        toast.success('Video nền đã được tạo thành công!');
      }

      form.reset();
      setSelectedImage(null);
      onSuccess?.();
    } catch (error) {
      toast.error('Không thể tạo video nền');
      console.error('Create background video error:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file hình ảnh phải nhỏ hơn 5MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const isLoading = createVideoMutation.isPending || uploadImageMutation.isPending;
  const videoTypes = typesData?.items || [];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              disabled={isLoading}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="type_id"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Loại video</FieldLabel>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại video" />
              </SelectTrigger>
              <SelectContent>
                {videoTypes.map((type: BackgroundVideoTypeResponseSchema) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>Hình thu nhỏ (tùy chọn)</FieldLabel>
        <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
        {selectedImage && (
          <p className="text-muted-foreground mt-1 text-sm">
            Đã chọn: {selectedImage.name} ({(selectedImage.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          Chọn hình thu nhỏ cho video. Bạn có thể upload sau nếu cần.
        </p>
      </Field>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tạo...' : 'Tạo video'}
        </Button>
      </div>
    </form>
  );
};

export default CreateBackgroundVideoForm;
