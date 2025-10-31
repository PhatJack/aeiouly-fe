'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
    <div className="relative flex w-full flex-col items-center">
      <div key="create-form" className="w-full">
        <div>
          <Form {...createPostForm}>
            <form onSubmit={createPostForm.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={createPostForm.control}
                name="image"
                render={() => (
                  <FormItem>
                    <ImageUpload control={createPostForm.control} name="image" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createPostForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} placeholder="Nội dung bài viết..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Đăng bài viết
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
