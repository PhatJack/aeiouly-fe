'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ImageUpload } from '@/components/ImageUpload';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { PostCreateSchema, PostResponseSchema, postCreateSchema } from '@/lib/schema/post.schema';
import { useCreatePostMutation } from '@/services/posts';
import { useCreatePostImageMutation } from '@/services/posts/create-post-image.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface CreatePostProps {
  onSuccess?: (data: PostResponseSchema) => void;
}

const CreatePost = ({ onSuccess }: CreatePostProps = {}) => {
  const postMutation = useCreatePostMutation();
  const postImageMutation = useCreatePostImageMutation();
  const createPostForm = useForm<PostCreateSchema>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      content: '',
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
    <div className="relative flex h-full w-full flex-col items-center">
      <div key="create-form" className="size-full">
        <div>
          <form onSubmit={createPostForm.handleSubmit(onSubmit)} className="h-full space-y-6">
            <Controller
              control={createPostForm.control}
              name="image"
              render={({ field, fieldState }) => (
                <Field>
                  <ImageUpload control={createPostForm.control} name="image" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={createPostForm.control}
              name="content"
              render={({ field, fieldState }) => (
                <Field className="h-full">
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
            <Button type="submit" className="w-full">
              Đăng bài viết
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
