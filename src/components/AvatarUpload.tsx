'use client';

import { useEffect } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { MAX_FILE_SIZE } from '@/constants/image';
import { useFileUpload } from '@/hooks/use-file-upload';

import { CircleUserRoundIcon, XIcon } from 'lucide-react';

interface AvatarUploadProps<T extends FieldValues> {
  fallback?: string;
  control: Control<T>;
  name: FieldPath<T>;
  maxSizeMB?: number;
}

export default function AvatarUpload<T extends FieldValues>({
  fallback,
  maxSizeMB = MAX_FILE_SIZE,
  control,
  name,
}: AvatarUploadProps<T>) {
  const { field } = useController({ control, name });
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize: maxSizeMB,
  });

  const previewUrl = files[0]?.preview || null;

  useEffect(() => {
    field.onChange(files.length > 0 ? files[0].file : null);
  }, [files, field]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt={files[0]?.file?.name || 'Uploaded image'}
              width={64}
              height={64}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden="true">
              <span>{fallback || 'AE'}</span>
            </div>
          )}
        </button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
          onBlur={field.onBlur}
        />
      </div>
    </div>
  );
}
