'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import dynamic from 'next/dynamic';
import { useRouter } from 'nextjs-toploader/app';

import { ImageUpload } from '@/components/ImageUpload';
import LoadingWithText from '@/components/LoadingWithText';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { PostUpdateSchema, postUpdateSchema } from '@/lib/schema/post.schema';
import { useGetPostQuery, useUpdatePostMutation } from '@/services/posts';
import { useCreatePostImageMutation } from '@/services/posts/create-post-image.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface EditPostProps {
  postId: number;
}

const Editor = dynamic(() => import('@/components/editor/tiptap-editor'), {
  ssr: false,
  loading: () => <LoadingWithText text="Đang tải trình soạn thảo..." />,
});

const EditPost = ({ postId }: EditPostProps) => {
  const router = useRouter();
  const { data: post } = useGetPostQuery(postId);
  const updatePostMutation = useUpdatePostMutation();
  const postImageMutation = useCreatePostImageMutation();

  const editPostForm = useForm<PostUpdateSchema>({
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      content: '',
      image: undefined,
      is_published: false,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (postId && post) {
      editPostForm.reset({
        content: post.content,
        image: post.image_url,
        is_published: post.is_published,
      });
    }
  }, [post, editPostForm, postId]);

  const onSubmit = (data: PostUpdateSchema) => {
    const { image, ...rest } = data;
    updatePostMutation.mutate(
      { postId, data: rest },
      {
        onSuccess: () => {
          if (image && typeof image !== 'string') {
            postImageMutation.mutate(
              { post_id: postId, body: { image } },
              {
                onSuccess: () => {
                  toast.success('Cập nhật bài viết thành công!');
                  router.push('/admin/posts');
                },
                onError: () => {
                  toast.error('Bài viết đã được cập nhật nhưng có lỗi khi tải ảnh lên');
                  router.push('/admin/posts');
                },
              }
            );
          } else {
            toast.success('Cập nhật bài viết thành công!');
            router.push('/admin/posts');
          }
        },
        onError: () => toast.error('Lỗi khi cập nhật bài viết'),
      }
    );
  };

  if (!post) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-full space-y-8">
        <form onSubmit={editPostForm.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FieldGroup className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <Controller
                control={editPostForm.control}
                name="image"
                render={({ fieldState }) => (
                  <Field>
                    <FieldLabel>Hình ảnh</FieldLabel>
                    <ImageUpload control={editPostForm.control} name="image" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={editPostForm.control}
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
                control={editPostForm.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field className="w-full">
                    <FieldLabel>Nội dung bài viết</FieldLabel>
                    <Editor
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
            <Button type="submit" disabled={updatePostMutation.isPending}>
              Cập nhật bài viết
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

export default EditPost;
