"use client";

import AvatarCustom from "@/components/custom/AvatarCustom";
import React, { memo, useCallback } from "react";
import LikeButton from "./LikeButton";
import { PostResponseSchema } from "@/lib/schema/post.schema";
import { useTogglePostLikeMutation } from "@/services/posts";
import { distanceToNowVN } from "@/lib/timezone";
interface PostItemProps {
  post: PostResponseSchema;
}

const PostItem = ({ post }: PostItemProps) => {
  const toggleLikeMutation = useTogglePostLikeMutation();

  const handleLikeToggle = useCallback(() => {
    toggleLikeMutation.mutate(post.id, {
      onSuccess: (data) => {
        post.is_liked_by_user = data.is_liked;
        post.likes_count = data.likes_count;
      },
    });
  }, [post.id]);

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <AvatarCustom url="/avatar.gif" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post?.author.username}
              </p>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post?.created_at && distanceToNowVN(post?.created_at)}
              </span>
            </div>
            <LikeButton
              onClick={handleLikeToggle}
              totalLikes={post.likes_count}
              isLikedByUser={post.is_liked_by_user}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-base"
        dangerouslySetInnerHTML={{
          __html: post?.content || "",
        }}
      />
    </div>
  );
};

export default memo(PostItem);
