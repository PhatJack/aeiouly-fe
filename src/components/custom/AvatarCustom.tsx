import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarCustomProps {
  url: string;
  fallback?: string;
}
const AvatarCustom = ({ url, fallback }: AvatarCustomProps) => {
  return (
    <Avatar>
      <AvatarImage src={url} alt={fallback || "Avatar"} />
      <AvatarFallback>{fallback || "CN"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCustom;
