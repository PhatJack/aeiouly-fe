'use client';

import React, { memo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingSessionSummarySchema } from '@/lib/schema/reading-session.schema';
import { getLevelColor } from '@/lib/utils';

import { BookOpen, FileText, Sparkles } from 'lucide-react';

interface ReadingSessionCardProps {
  session: ReadingSessionSummarySchema;
  onClick?: () => void;
}

const ReadingSessionCard = memo(({ session, onClick }: ReadingSessionCardProps) => {
  return (
    <Card
      className="border-l-primary cursor-pointer overflow-hidden border-l-4 bg-white"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Reading session: ${session.topic}`}
    >
      <CardContent>
        <div className="flex items-start justify-between gap-5">
          {/* Left side - Icon and Content */}
          <div className="flex min-w-0 flex-1 gap-4">
            {/* Icon */}
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
              <BookOpen className="text-primary h-6 w-6" />
              {session.is_custom && (
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-2">
              {/* Title */}
              <h3 className="text-foreground line-clamp-2 text-lg font-semibold">
                {session.topic}
              </h3>

              {/* Metadata */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>{session.genre}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{session.word_count} từ</span>
                </div>
              </div>

              {/* Custom badge */}
              {session.is_custom && (
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"
                >
                  Văn bản tự chọn
                </Badge>
              )}
            </div>
          </div>

          {/* Right side - Level Badge */}
          <div className="flex-shrink-0">
            <Badge
              variant="outline"
              className={`${getLevelColor(session.level)} px-3 py-1 text-sm font-semibold uppercase`}
            >
              {session.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ReadingSessionCard.displayName = 'ReadingSessionCard';

export default ReadingSessionCard;
