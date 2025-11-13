import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AvatarCustomProps {
  url?: string;
  fallback?: string;
  className?: string;
}
const AvatarCustom = ({ url, fallback, className }: AvatarCustomProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt={fallback || 'Avatar'} />
      <AvatarFallback className="border">{fallback || 'AE'}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCustom;
