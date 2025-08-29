"use client";
import { IconButton } from "@/components/animate-ui/icon-button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import React, { useState } from "react";

interface LikeButtonProps {
  onClick?: () => void;
  className?: string;
  totalLikes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  onClick,
  className,
  totalLikes,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {
        <span className="text-lg font-medium">
          {isLiked ? totalLikes + 1 : totalLikes}
        </span>
      }
      <IconButton
        className={cn(className)}
        icon={Heart}
        onClick={handleClick}
        active={isLiked}
        color={isLiked ? [220, 38, 38] : [107, 124, 118]}
      />
    </div>
  );
};

export default LikeButton;
