'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PostResponseSchema } from '@/lib/schema/post.schema';
import { distanceToNowVN } from '@/lib/timezone';
import { cn } from '@/lib/utils';
import { useTogglePostLikeMutation } from '@/services/posts';

import { enUS, vi } from 'date-fns/locale';
import { toast } from 'sonner';

import LikeButton from './LikeButton';

interface PostItemProps {
  post: PostResponseSchema;
}

const PostItem = ({ post }: PostItemProps) => {
  const locale = useLocale();
  const t = useTranslations('PostsFeed');
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleLikeMutation = useTogglePostLikeMutation();

  const handleLikeToggle = useCallback(() => {
    toggleLikeMutation.mutate(post.id, {
      onSuccess: (data) => {
        post.is_liked_by_user = data.is_liked;
        post.likes_count = data.likes_count;
      },
      onError: (error: any) => {
        toast.error(error?.detail || 'Đã có lỗi xảy ra khi thích bài viết.');
        // Optionally handle error (e.g., show a toast)
      },
    });
  }, [post.id]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!contentRef.current) return;
      const fullHeight = contentRef.current.scrollHeight;
      setNeedsClamp(isMobile && fullHeight > 300);
    };
    // Initial measure
    measure();
    // Observe dynamic content changes
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && contentRef.current) ro.observe(contentRef.current);
    return () => {
      if (ro) ro.disconnect();
    };
  }, [isMobile, post.content]);

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
                  {distanceToNowVN(post.created_at, locale === 'vi' ? vi : enUS)}
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

        <div className="relative mt-3">
          <div
            ref={contentRef}
            className={cn(
              'prose prose-sm dark:prose-invert prose-p:text-foreground dark:prose-p:text-gray-300 prose-strong:text-foreground dark:prose-strong:text-white prose-headings:text-foreground dark:prose-headings:text-white max-w-none leading-relaxed *:mb-0',
              needsClamp && !isExpanded ? 'max-h-[300px] overflow-hidden' : ''
            )}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {needsClamp && !isExpanded && (
            <div className="dark:from-background pointer-events-none absolute right-0 bottom-8 left-0 h-12 bg-gradient-to-t from-white to-transparent" />
          )}

          {needsClamp && (
            <div>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded((v) => !v)}>
                {isExpanded ? t('showLess') : t('showMore')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(PostItem);
