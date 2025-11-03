'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SoundCreateSchema, soundCreateSchema } from '@/lib/schema/sound.schema';
import { useCreateSoundMutation, useUploadSoundFileMutation } from '@/services/sounds';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreateSoundFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateSoundForm = ({ onSuccess, onCancel }: CreateSoundFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createSoundMutation = useCreateSoundMutation();
  const uploadSoundFileMutation = useUploadSoundFileMutation();

  const form = useForm<SoundCreateSchema>({
    resolver: zodResolver(soundCreateSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: SoundCreateSchema) => {
    try {
      // First create the sound
      const sound = await createSoundMutation.mutateAsync(data);

      // Then upload the file if selected
      if (selectedFile) {
        await uploadSoundFileMutation.mutateAsync({
          soundId: sound.id,
          soundFile: selectedFile,
        });
        toast.success('Tạo âm thanh và upload file thành công!');
      } else {
        toast.success('Tạo âm thanh thành công!');
      }

      form.reset();
      setSelectedFile(null);
      onSuccess?.();
    } catch (error) {
      toast.error('Lỗi khi tạo âm thanh');
      console.error('Create sound error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Chỉ chấp nhận file âm thanh');
        return;
      }
      setSelectedFile(file);
    }
  };

  const isLoading = createSoundMutation.isPending || uploadSoundFileMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Tên âm thanh</FieldLabel>
            <Input {...field} placeholder="Nhập tên âm thanh..." disabled={isLoading} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>File âm thanh (tùy chọn)</FieldLabel>
        <Input type="file" accept="audio/*" onChange={handleFileChange} disabled={isLoading} />
        {selectedFile && (
          <p className="text-muted-foreground mt-1 text-sm">
            Đã chọn: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          Chọn file âm thanh để upload. Bạn có thể upload sau nếu muốn.
        </p>
      </Field>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tạo...' : 'Tạo âm thanh'}
        </Button>
      </div>
    </form>
  );
};

export default CreateSoundForm;
