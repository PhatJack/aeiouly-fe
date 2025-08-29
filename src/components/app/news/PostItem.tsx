"use client";

import AvatarCustom from "@/components/custom/AvatarCustom";
import React from "react";
import LikeButton from "./LikeButton";

interface PostItemProps {}

const PostItem = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 transition">
      {/* Header */}
      <div className="flex items-start gap-3">
        <AvatarCustom url="/avatar.gif" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Author
              </p>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Date
              </span>
            </div>
            <LikeButton onClick={() => console.log("Liked!")} totalLikes={2} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-base"
        dangerouslySetInnerHTML={{
          __html:
            "<p>Nan Ngôn là nỗi lòng không thể nói ra của Quỷ Lệ, là bức thư tình Trương Tiểu Phàm dành cho Lục Tuyết Kỳ nhưng chưa bao giờ đến được tay nàng.<br/>Cuộc đời Quỷ Lệ là một chuỗi những tháng ngày giằng xé không ngừng...</p>",
        }}
      />
    </div>
  );
};

export default PostItem;
