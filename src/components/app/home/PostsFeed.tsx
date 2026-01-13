'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import PostItem from '@/components/app/news/PostItem';
import { useInfiniteGetAllPostsQuery } from '@/services/posts';
import { useInfiniteQuery } from '@tanstack/react-query';

const PostsFeed = () => {
  const t = useTranslations('PostsFeed');

  const { ref, inView } = useInView({
    rootMargin: '100px',
    threshold: 0.5,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    useInfiniteGetAllPostsQuery({ size: 5 })
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <LoadingWithText text={t('loading')} />;
  }

  if (status === 'error') {
    return <div className="flex justify-center p-8 text-red-500">{t('error')}</div>;
  }

  return (
    <div className="min-h-dvh space-y-4 overflow-y-auto">
      {data?.items.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}

      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <div>{t('loadingMore')}</div>}
      </div>
    </div>
  );
};

export default PostsFeed;
