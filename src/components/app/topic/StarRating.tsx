import React from 'react';

import { cn } from '@/lib/utils';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  displayText?: boolean;
}

const StarRating = ({ rating, displayText }: StarRatingProps) => {
  const ratingText =
    rating === 5
      ? 'Rất khó'
      : rating === 4
        ? 'Khó'
        : rating === 3
          ? 'Trung bình'
          : rating === 2
            ? 'Dễ'
            : 'Rất dễ';

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>
          <Star size={20} className={cn('text-yellow-500', index < rating && 'fill-yellow-500')} />
        </span>
      ))}
      {displayText && (
        <span className="text-muted-foreground ml-2 text-sm font-medium">{ratingText}</span>
      )}
    </div>
  );
};

export default StarRating;
