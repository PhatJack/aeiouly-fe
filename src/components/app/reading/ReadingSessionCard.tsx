'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReadingSessionSummarySchema } from '@/lib/schema/reading-session.schema';
import { getLevelColor } from '@/lib/utils';

import { BookOpen, FileText, Sparkles, Trash2 } from 'lucide-react';

interface ReadingSessionCardProps {
  session: ReadingSessionSummarySchema;
  onClick?: () => void;
  onDelete?: (sessionId: number) => void;
  isDeleting?: boolean;
}

const ReadingSessionCard = memo(
  ({ session, onClick, onDelete, isDeleting }: ReadingSessionCardProps) => {
    const t = useTranslations('reading');

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete && confirm(t('session.deleteConfirm'))) {
        onDelete(session.id);
      }
    };

    return (
      <Card
        className="group border-l-primary dark:bg-background cursor-pointer overflow-hidden border-l-4 bg-white transition-all"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-label={`Reading session: ${session.topic}`}
      >
        <CardContent className="relative">
          <div className="flex items-start justify-between gap-5">
            {/* Left side - Icon and Content */}
            <div className="flex min-w-0 flex-1 gap-4">
              {/* Icon */}
              <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <BookOpen className="text-primary h-6 w-6" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 space-y-2">
                {/* Title */}
                <h3
                  title={session.topic}
                  className="text-foreground line-clamp-1 text-lg font-semibold"
                >
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
                    <span>{t('session.words', { count: session.word_count })}</span>
                  </div>
                </div>

                {/* Custom badge */}
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"
                >
                  {t('session.customText')}
                </Badge>
              </div>
            </div>

            {/* Right side - Level Badge and Delete Button */}
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={`${getLevelColor(session.level)} px-3 py-1 font-semibold uppercase`}
              >
                {session.level}
              </Badge>

              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 h-8 w-8 opacity-0 transition-all group-hover:opacity-100"
                  aria-label={t('session.deleteAria')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ReadingSessionCard.displayName = 'ReadingSessionCard';

export default ReadingSessionCard;
