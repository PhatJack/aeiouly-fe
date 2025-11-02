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
    try {
      const data = await togglePostLikeApi(post.id);
      post.is_liked_by_user = data.is_liked;
      post.likes_count = data.likes_count;
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [post.id]);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <AvatarCustom url={post.author.avatar_url || '/avatar.gif'} className="size-10" />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post.author.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {distanceToNowVN(post.created_at)}
              </p>
            </div>

            <LikeButton
              onClick={handleLikeToggle}
              totalLikes={post.likes_count}
              isLikedByUser={post.is_liked_by_user}
              className="scale-90"
            />
          </div>
        </div>
      </div>

      {post.image_url && (
        <div className="mt-3 overflow-hidden rounded-lg">
          <Image
            src={post.image_url}
            alt="Post image"
            width={800}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div
        className="prose mt-3 leading-relaxed text-gray-800 *:mb-0 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </div>
  );
};

export default memo(PostItem);
