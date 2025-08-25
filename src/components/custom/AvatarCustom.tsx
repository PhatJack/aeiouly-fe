import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarCustomProps {
  url: string;
  fallback?: string;
  className?: string;
}
const AvatarCustom = ({ url, fallback, className }: AvatarCustomProps) => {
  return (
    <Avatar className={cn(className,"size-10")}>
      <AvatarImage src={url} alt={fallback || "Avatar"} />
      <AvatarFallback className="border">{fallback || "AE"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCustom;
