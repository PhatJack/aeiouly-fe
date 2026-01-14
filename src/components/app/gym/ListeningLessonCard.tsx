'use client';

import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';
import { distanceToNowVN } from '@/lib/timezone';
import { UrlToEmbeded, cn, getLevelColor } from '@/lib/utils';

import { enUS, vi } from 'date-fns/locale';
import { BookOpen, Calendar, Clock, PlayCircle } from 'lucide-react';

interface ListeningLessonCardProps {
  lesson: LessonResponseSchema;
  onClick?: () => void;
}

const ListeningLessonCard = ({ lesson, onClick }: ListeningLessonCardProps) => {
  const locale = useLocale();
  const t = useTranslations('listening');

  // Mock duration for demo purposes (replace with actual duration if available)
  const duration = '12:34'; // Example duration, adjust based on your data

  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden rounded-lg border py-0 shadow-sm transition-shadow hover:shadow-md'
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex h-full flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={`https://img.youtube.com/vi/${UrlToEmbeded(lesson.youtube_url)?.videoId}/maxresdefault.jpg`}
              alt={lesson.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              fill
              priority
            />
            {/* Duration Overlay */}
            <div className="bg-opacity-80 absolute right-2 bottom-2 rounded bg-black px-1.5 py-0.5 text-xs font-medium text-white">
              {duration}
            </div>
            {/* Play Icon on Hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <PlayCircle strokeWidth={1} className="size-14 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between gap-2 p-4">
            {/* Title */}
            <h3
              title={lesson.title}
              className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold transition-colors md:text-base"
            >
              {lesson.title}
            </h3>

            {/* Metadata */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="default" className={cn(getLevelColor(lesson.level), 'text-xs')}>
                {lesson.level}
              </Badge>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t('lesson.sentences', { count: lesson.total_sentences })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{distanceToNowVN(lesson.created_at, locale === 'vi' ? vi : enUS)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListeningLessonCard;
