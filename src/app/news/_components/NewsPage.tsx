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
  // console.log(posts.);
  return (
    <div className="w-full flex">
      {state.user?.role === "ADMIN" && <CreatePost />}
      <div ref={ref} className="max-w-3xl mx-auto grid gap-6 divide-y">
        {posts &&
          posts.items.length > 0 &&
          posts.items.map((post) => <PostItem key={post.id} {...post} />)}
      </div>
    </div>
  );
};

export default NewsPage;
