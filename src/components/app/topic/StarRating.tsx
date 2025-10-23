import React, { useMemo } from 'react';

import { CEFRLevel } from '@/lib/schema/writing-session.schema';
import { cn } from '@/lib/utils';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: CEFRLevel | undefined;
  displayText?: boolean;
}

const StarRating = ({ rating = 'A1', displayText }: StarRatingProps) => {
  const ratingTextMap: Record<CEFRLevel, string> = {
    A1: 'Sơ cấp',
    A2: 'Sơ trung cấp',
    B1: 'Trung cấp',
    B2: 'Trung cao cấp',
    C1: 'Cao cấp',
    C2: 'Thành thạo',
  };

  return (
    <div className="flex gap-1">
      {Object.keys(ratingTextMap).map((level) => (
        <span key={level}>
          <Star
            size={20}
            className={cn('text-yellow-500', level === rating && 'fill-yellow-500')}
          />
        </span>
      ))}
      {/* {Array.from({ length: 6 }, (_, index) => (
        <span key={index}>
          <Star size={20} className={cn('text-yellow-500', rating && 'fill-yellow-500')} />
        </span>
      ))} */}
      {displayText && (
        <span className="text-muted-foreground ml-2 text-sm font-medium">
          {ratingTextMap[rating]}
        </span>
      )}
    </div>
  );
};

export default StarRating;
