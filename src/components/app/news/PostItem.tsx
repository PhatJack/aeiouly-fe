'use client';

import React, { memo, useCallback } from 'react';

import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card>
      <CardContent>
        <div className="flex items-center gap-2">
          <AvatarCustom url={post.author.avatar_url || ''} className="size-10" />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-semibold dark:text-white">
                  {post.author.username}
                </p>
                <p className="text-muted-foreground text-sm dark:text-gray-400">
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
          <div className="ring-border dark:ring-border/50 mt-3 overflow-hidden rounded-lg ring-1">
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
          className="prose prose-sm dark:prose-invert prose-p:text-foreground dark:prose-p:text-gray-300 prose-strong:text-foreground dark:prose-strong:text-white prose-headings:text-foreground dark:prose-headings:text-white mt-3 max-w-none leading-relaxed *:mb-0"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </CardContent>
    </Card>
  );
};

export default memo(PostItem);
