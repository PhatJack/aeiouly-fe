'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/configs/route';
import {
  SoundResponseSchema,
  SoundUpdateSchema,
  soundUpdateSchema,
} from '@/lib/schema/sound.schema';
import {
  useGetSoundQuery,
  useUpdateSoundMutation,
  useUploadSoundFileMutation,
} from '@/services/sounds';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface EditSoundFormProps {
  soundId: number;
}

const EditSoundForm = ({ soundId }: EditSoundFormProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: sound, isLoading } = useGetSoundQuery(soundId);
  const updateSoundMutation = useUpdateSoundMutation();
  const uploadSoundFileMutation = useUploadSoundFileMutation();

  const form = useForm<SoundUpdateSchema>({
    resolver: zodResolver(soundUpdateSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (sound) {
      form.reset({
        name: sound.name,
      });
    }
  }, [sound, form]);

  const onSubmit = async (data: SoundUpdateSchema) => {
    try {
      // Update sound name first
      if (data.name !== sound?.name) {
        await updateSoundMutation.mutateAsync({ soundId, data });
      }

      // Then upload file if selected
      if (selectedFile) {
        await uploadSoundFileMutation.mutateAsync({
          soundId,
          soundFile: selectedFile,
        });
        toast.success('Âm thanh đã được cập nhật và file đã được upload thành công!');
      } else {
        toast.success('Âm thanh đã được cập nhật thành công!');
      }

      setSelectedFile(null);
    } catch (error) {
      toast.error('Không thể cập nhật âm thanh');
      console.error('Update sound error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Vui lòng chọn file âm thanh');
        return;
      }
      setSelectedFile(file);
    }
  };

  const isUpdating = updateSoundMutation.isPending || uploadSoundFileMutation.isPending;

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!sound) {
    return <div>Không tìm thấy âm thanh</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Tên âm thanh</FieldLabel>
            <Input {...field} placeholder="Nhập tên âm thanh..." disabled={isUpdating} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">File âm thanh hiện tại</h3>
        {sound.sound_file_url ? (
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">File hiện tại:</p>
            <audio controls className="w-full">
              <source src={sound.sound_file_url} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ phần tử âm thanh.
            </audio>
            {sound.file_size && (
              <p className="text-muted-foreground mt-2 text-sm">
                Kích thước: {(sound.file_size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
            {sound.duration && (
              <p className="text-muted-foreground text-sm">
                Thời lượng: {Math.floor(sound.duration / 60)}:
                {Math.floor(sound.duration % 60)
                  .toString()
                  .padStart(2, '0')}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Chưa upload file âm thanh nào</p>
        )}
      </div>

      <Field>
        <FieldLabel>Upload file âm thanh mới (tùy chọn)</FieldLabel>
        <Input type="file" accept="audio/*" onChange={handleFileChange} disabled={isUpdating} />
        {selectedFile && (
          <p className="text-muted-foreground mt-1 text-sm">
            Đã chọn: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          Upload file âm thanh mới để thay thế file hiện tại. Định dạng hỗ trợ: MP3, WAV, v.v.
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
          {isUpdating ? 'Đang cập nhật...' : 'Cập nhật âm thanh'}
        </Button>
      </div>
    </form>
  );
};

export default EditSoundForm;
