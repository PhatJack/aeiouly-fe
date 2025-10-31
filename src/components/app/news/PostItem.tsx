'use client';

import React, { memo, useCallback } from 'react';

import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { PostResponseSchema } from '@/lib/schema/post.schema';
import { distanceToNowVN } from '@/lib/timezone';
import { togglePostLikeApi } from '@/services/posts';

import LikeButton from './LikeButton';

interface PostItemProps {
  post: PostResponseSchema;
}

const PostItem = ({ post }: PostItemProps) => {
  const handleLikeToggle = useCallback(async () => {
    await togglePostLikeApi(post.id)
      .then((data) => {
        post.is_liked_by_user = data.is_liked;
        post.likes_count = data.likes_count;
      })
      .catch((error) => {
        console.error('Error toggling like:', error);
      });
  }, [post.id]);

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <AvatarCustom url="/avatar.gif" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
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
      {/* Image */}
      {post?.image_url && (
        <div className="mt-3 w-full overflow-hidden rounded-lg">
          <Image
            src={post.image_url}
            alt={'Hình ảnh'}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
      )}
      {/* Content */}
      <div
        className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{
          __html: post?.content || '',
        }}
      />
    </div>
  );
};

export default memo(PostItem);
