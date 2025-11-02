'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

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
import { ROUTE } from '@/configs/route';
import {
  BackgroundVideoTypeResponseSchema,
  BackgroundVideoUpdateSchema,
  backgroundVideoUpdateSchema,
} from '@/lib/schema/background-video.schema';
import { useGetAllBackgroundVideoTypesQuery } from '@/services/background-video-types';
import {
  useGetBackgroundVideoQuery,
  useUpdateBackgroundVideoMutation,
  useUploadBackgroundVideoImageMutation,
} from '@/services/background-videos';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface EditBackgroundVideoFormProps {
  videoId: number;
}

const EditBackgroundVideoForm = ({ videoId }: EditBackgroundVideoFormProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { data: video, isLoading: videoLoading } = useGetBackgroundVideoQuery(videoId);
  const { data: typesData } = useGetAllBackgroundVideoTypesQuery({ page: 1, size: 100 });
  const updateVideoMutation = useUpdateBackgroundVideoMutation();
  const uploadImageMutation = useUploadBackgroundVideoImageMutation();

  const form = useForm<BackgroundVideoUpdateSchema>({
    resolver: zodResolver(backgroundVideoUpdateSchema),
    defaultValues: {
      youtube_url: '',
      type_id: undefined,
    },
  });

  useEffect(() => {
    if (video) {
      form.reset({
        youtube_url: video.youtube_url,
        type_id: video.type_id,
      });
    }
  }, [video, form]);

  const onSubmit = async (data: BackgroundVideoUpdateSchema) => {
    try {
      // Update video info first
      const hasChanges = data.youtube_url !== video?.youtube_url || data.type_id !== video?.type_id;
      if (hasChanges) {
        await updateVideoMutation.mutateAsync({ videoId, data });
      }

      // Then upload image if selected
      if (selectedImage) {
        await uploadImageMutation.mutateAsync({
          videoId,
          imageFile: selectedImage,
        });
        toast.success('Video đã được cập nhật và hình ảnh đã được upload thành công!');
      } else if (hasChanges) {
        toast.success('Video đã được cập nhật thành công!');
      } else {
        toast.info('Không có thay đổi để cập nhật');
      }

      setSelectedImage(null);
    } catch (error) {
      toast.error('Không thể cập nhật video');
      console.error('Update video error:', error);
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

  const isUpdating = updateVideoMutation.isPending || uploadImageMutation.isPending;
  const videoTypes = typesData?.items || [];

  if (videoLoading) {
    return <div>Đang tải...</div>;
  }

  if (!video) {
    return <div>Không tìm thấy video</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hình thu nhỏ hiện tại</h3>
        {video.image_url ? (
          <div className="rounded-lg border p-4">
            <img
              src={video.image_url}
              alt="Hình thu nhỏ video"
              className="h-auto w-full max-w-md rounded"
            />
          </div>
        ) : (
          <p className="text-muted-foreground">Chưa upload hình thu nhỏ nào</p>
        )}
      </div>

      <Field>
        <FieldLabel>Upload hình thu nhỏ mới (tùy chọn)</FieldLabel>
        <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isUpdating} />
        {selectedImage && (
          <p className="text-muted-foreground mt-1 text-sm">
            Đã chọn: {selectedImage.name} ({(selectedImage.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          Upload hình thu nhỏ mới (tối đa 5MB). Định dạng hỗ trợ: JPG, PNG, v.v.
        </p>
      </Field>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX)}
          disabled={isUpdating}
        >
          Quay lại danh sách
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Đang cập nhật...' : 'Cập nhật video'}
        </Button>
      </div>
    </form>
  );
};

export default EditBackgroundVideoForm;
