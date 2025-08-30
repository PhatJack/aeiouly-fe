"use client";
import React from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCreatePostMutation } from "@/services/posts";
import { postCreateSchema, PostCreateSchema } from "@/lib/schema/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = () => {
  const postMutation = useCreatePostMutation();
  const createPostForm = useForm<PostCreateSchema>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      content: "",
      is_published: true,
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: PostCreateSchema) => {
    postMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đăng bài viết thành công");
        createPostForm.reset();
      },
    });
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      <motion.div
        key="create-form"
        className="w-full"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Form {...createPostForm}>
            <form
              onSubmit={createPostForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
      </motion.div>
    </div>
  );
};

export default CreatePost;
