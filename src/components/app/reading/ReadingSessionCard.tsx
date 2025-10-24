'use client';

import React, { memo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingSessionSummarySchema } from '@/lib/schema/reading-session.schema';

import { BookOpen, FileText, Sparkles } from 'lucide-react';

interface ReadingSessionCardProps {
  session: ReadingSessionSummarySchema;
  onClick?: () => void;
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    A1: 'bg-green-100 text-green-700 border-green-300',
    A2: 'bg-blue-100 text-blue-700 border-blue-300',
    B1: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    B2: 'bg-orange-100 text-orange-700 border-orange-300',
    C1: 'bg-red-100 text-red-700 border-red-300',
    C2: 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
};

const ReadingSessionCard = memo(({ session, onClick }: ReadingSessionCardProps) => {
  return (
    <Card
      className="group border-l-primary cursor-pointer overflow-hidden border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Icon and Content */}
          <div className="flex min-w-0 flex-1 gap-4">
            {/* Icon */}
            <div className="bg-primary/10 group-hover:bg-primary/20 relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-colors">
              <BookOpen className="text-primary h-7 w-7" />
              {session.is_custom && (
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-3">
              {/* Title */}
              <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
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
                  className="border-amber-300 bg-amber-50 text-xs text-amber-700"
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
              className={`${getLevelColor(session.level)} px-3 py-1 font-semibold`}
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
