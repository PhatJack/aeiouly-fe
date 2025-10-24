'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';
import { distanceToNowVN } from '@/lib/timezone';
import { cn } from '@/lib/utils';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookOpen, Calendar, Headphones, PlayCircle } from 'lucide-react';

interface ListeningLessonCardProps {
  lesson: LessonResponseSchema;
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

const ListeningLessonCard = ({ lesson, onClick }: ListeningLessonCardProps) => {
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
            <div
              className={cn(
                'bg-primary/10 hover:bg-primary/20 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-colors'
              )}
            >
              <Headphones className="text-primary h-7 w-7" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-3">
              {/* Title */}
              <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
                {lesson.title}
              </h3>

              {/* Metadata */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.total_sentences} câu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{distanceToNowVN(lesson.created_at)}</span>
                </div>
              </div>

              {/* YouTube URL Preview */}
              {lesson.youtube_url && (
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <PlayCircle className="h-3.5 w-3.5" />
                  <span className="truncate">{lesson.youtube_url}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Level Badge */}
          <div className="flex-shrink-0">
            <Badge
              variant="outline"
              className={`${getLevelColor(lesson.level)} px-3 py-1 font-semibold`}
            >
              {lesson.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListeningLessonCard;
