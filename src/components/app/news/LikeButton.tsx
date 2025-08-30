"use client";
import { IconButton } from "@/components/animate-ui/icon-button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import React, { useState } from "react";

interface LikeButtonProps {
  onClick?: () => void;
  className?: string;
  totalLikes: number;
  isLikedByUser?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  onClick,
  className,
  totalLikes,
  isLikedByUser,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedByUser || false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-lg font-medium">
        {totalLikes}
      </span>
      <IconButton
        className={cn(className)}
        icon={Heart}
        onClick={handleClick}
        active={isLikedByUser && isLiked}
        color={isLikedByUser && isLiked ? [220, 38, 38] : [107, 124, 118]}
      />
    </div>
  );
};

export default LikeButton;
