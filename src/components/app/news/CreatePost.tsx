'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

import { ImageUpload } from '@/components/ImageUpload';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { PostCreateSchema, PostResponseSchema, postCreateSchema } from '@/lib/schema/post.schema';
import { useCreatePostMutation } from '@/services/posts';
import { useCreatePostImageMutation } from '@/services/posts/create-post-image.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreatePostProps {
  onSuccess?: (data: PostResponseSchema) => void;
}

const CreatePost = ({ onSuccess }: CreatePostProps = {}) => {
  const router = useRouter();
  const postMutation = useCreatePostMutation();
  const postImageMutation = useCreatePostImageMutation();
  const createPostForm = useForm<PostCreateSchema>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      content: '',
      image: undefined,
      is_published: true,
    },
    mode: 'onSubmit',
  });
  const onSubmit = (data: PostCreateSchema) => {
    const { image, ...rest } = data;
    postMutation.mutate(rest, {
      onSuccess: (res) => {
        postImageMutation.mutate(
          {
            post_id: res.id,
            body: {
              image: data.image,
            },
          },
          {
            onSuccess: (data) => {
              toast.success('Đăng bài viết thành công');
              createPostForm.reset();
              router.push('/admin/posts');
              onSuccess?.(data);
            },
            onError: (error) => {
              toast.error(error.detail || 'Lỗi khi đăng bài viết');
              console.error('Post creation error:', error);
            },
          }
        );
      },
      onError: (error) => {
        toast.error('Lỗi khi đăng bài viết');
        console.error('Post creation error:', error);
      },
    });
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-full space-y-8">
        <form onSubmit={createPostForm.handleSubmit(onSubmit)} className="w-full space-y-8">
          {/* Image + Tiptap same row */}
          <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <Controller
                control={createPostForm.control}
                name="image"
                render={({ fieldState }) => (
                  <Field>
                    <FieldLabel>Hình ảnh</FieldLabel>
                    <ImageUpload control={createPostForm.control} name="image" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={createPostForm.control}
                name="is_published"
                render={({ field }) => (
                  <Field className="flex w-auto space-x-2">
                    <FieldLabel>Xuất bản bài viết</FieldLabel>
                    <Switch
                      checked={field.value}
                      className="max-w-8"
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </div>

            <div className="lg:col-span-8">
              <Controller
                control={createPostForm.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field className="w-full">
                    <FieldLabel>Nội dung bài viết</FieldLabel>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Nội dung bài viết..."
                      output="html"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={postMutation.isPending}>
              Đăng bài viết
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/posts')}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
