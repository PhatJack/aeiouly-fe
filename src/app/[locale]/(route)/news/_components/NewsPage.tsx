'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import PostItem from '@/components/app/news/PostItem';
import { useInfiniteGetAllPostsQuery } from '@/services/posts';
import { useInfiniteQuery } from '@tanstack/react-query';

const NewsPage = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage } = useInfiniteQuery({
    ...useInfiniteGetAllPostsQuery(),
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);
  return (
    <div className="grid w-full gap-4 lg:grid-cols-12">
      <div className="lg:col-span-3"></div>
      <div ref={ref} className="flex h-auto flex-col divide-y lg:col-span-5">
        {posts && posts.items.map((post) => <PostItem key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default NewsPage;
