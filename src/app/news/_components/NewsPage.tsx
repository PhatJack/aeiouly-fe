"use client";
import CreatePost from "@/components/app/news/CreatePost";
import PostItem from "@/components/app/news/PostItem";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInfiniteGetAllPostsQuery } from "@/services/posts";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const NewsPage = () => {
  const [state, dispatch] = useAuthContext();
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
    <div className="w-full grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-3">
        {state.user?.role === "admin" && <CreatePost />}
      </div>
      <div ref={ref} className="lg:col-span-5 grid gap-6 divide-y">
        {posts && posts.items.map((post) => <PostItem key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default NewsPage;
