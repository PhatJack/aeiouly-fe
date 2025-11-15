'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import PostItem from '@/components/app/news/PostItem';
import { useInfiniteGetAllPostsQuery } from '@/services/posts';
import { useInfiniteQuery } from '@tanstack/react-query';

import LoadingWithText from './LoadingWithText';

const PostsFeed = () => {
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
    return <LoadingWithText text="Đang tải các bài viết" />;
  }

  if (status === 'error') {
    return <div className="flex justify-center p-8 text-red-500">Lỗi khi tải bài viết</div>;
  }

  return (
    <div className="min-h-dvh space-y-4 overflow-y-auto">
      {data?.items.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}

      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <div>Đang tải thêm...</div>}
        {!hasNextPage && data?.items.length > 0 && (
          <div className="text-gray-700">Đã tải hết bài viết</div>
        )}
      </div>
    </div>
  );
};

export default PostsFeed;
