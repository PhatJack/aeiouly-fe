import PostItem from "@/components/app/news/PostItem";
import React from "react";

const NewsPage = () => {
  return (
    <div className="container xl:max-w-3xl mx-auto grid gap-6 divide-y">
      {Array.from({ length: 10 }).map((_, index) => (
        <PostItem key={index} />
      ))}
    </div>
  );
};

export default NewsPage;
