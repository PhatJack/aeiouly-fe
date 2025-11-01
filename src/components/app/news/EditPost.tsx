'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import TiptapEditor from '@/components/editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { PostUpdateSchema, postUpdateSchema } from '@/lib/schema/post.schema';
import { useGetPostQuery, useUpdatePostMutation } from '@/services/posts';
import { useCreatePostImageMutation } from '@/services/posts/create-post-image.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

interface EditPostProps {
  postId: number;
}

const EditPost = ({ postId }: EditPostProps) => {
  const router = useRouter();
  const { data: post, isLoading } = useGetPostQuery(postId);
  const updatePostMutation = useUpdatePostMutation();
  const postImageMutation = useCreatePostImageMutation();

  const editPostForm = useForm<PostUpdateSchema>({
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      content: '',
      is_published: false,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (post) {
      editPostForm.reset({
        content: post.content,
        is_published: post.is_published,
      });
    }
  }, [post, editPostForm]);

  const onSubmit = (data: PostUpdateSchema) => {
    updatePostMutation.mutate(
      {
        postId,
        data,
      },
      {
        onSuccess: (updatedPost) => {
          toast.success('Cập nhật bài viết thành công!');
          router.push('/admin/posts');
        },
        onError: (error) => {
          toast.error('Lỗi khi cập nhật bài viết');
          console.error('Update post error:', error);
        },
      }
    );
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!post) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <div key="edit-form" className="w-full">
        <div>
          <form onSubmit={editPostForm.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={editPostForm.control}
              name="content"
              render={({ field, fieldState }) => (
                <Field>
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

            <div className="flex gap-4">
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
    </div>
  );
};

export default EditPost;
