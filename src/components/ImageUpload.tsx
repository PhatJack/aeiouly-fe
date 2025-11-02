'use client';

import { useEffect, useMemo, useState } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';

import { MAX_FILE_SIZE } from '@/constants/image';
import { FileMetadata, useFileUpload } from '@/hooks/use-file-upload';
import { cn } from '@/lib/utils';

import { ImageUpIcon, XIcon } from 'lucide-react';

type ImageUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  maxSizeMB?: number;
  multiple?: boolean;
};

export function ImageUpload<T extends FieldValues>({
  control,
  name,
  maxSizeMB = MAX_FILE_SIZE,
  multiple = false,
}: ImageUploadProps<T>) {
  const { field } = useController({ control, name });
  const maxSize = maxSizeMB;

  const getInitialFiles = useMemo((): FileMetadata[] => {
    if (!field.value) return [];

    if (multiple && Array.isArray(field.value)) {
      return field.value.map((url: string, idx: number) => ({
        id: `existing-${idx}`,
        name: `image-${idx}`,
        url,
        size: 1528737,
        type: `image/${url.split('.').pop()?.split('?')[0]}`,
      }));
    }

    if (!multiple && typeof field.value === 'string') {
      return [
        {
          id: 'existing',
          name: 'image',
          url: field.value,
          size: 1528737,
          type: `image/${field.value.split('.').pop()?.split('?')[0]}`,
        },
      ];
    }

    return [];
  }, [field.value, multiple]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/*',
    maxSize,
    multiple,
    initialFiles: getInitialFiles,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="relative cursor-pointer">
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className={cn(
            'border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]'
          )}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload file"
            onBlur={field.onBlur}
          />

          {files.length > 0 ? (
            <div className={cn('grid gap-2', multiple ? 'grid-cols-2 md:grid-cols-3' : '')}>
              {files.map((file, idx) => (
                <div key={idx} className="relative size-full">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="focus-visible:border-ring focus-visible:ring-ring/50 absolute top-2 right-2 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                    onClick={() => removeFile(files[idx].id)}
                    aria-label="Remove image"
                  >
                    <XIcon className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">
                Thả {multiple ? 'nhiều hình ảnh' : 'hình ảnh'} vào đây hoặc nhấp để duyệt
              </p>
              <p className="text-muted-foreground text-xs">
                Kích thước tối đa: {maxSizeMB / 1024 / 1024}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="text-destructive text-sm">
          {errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
