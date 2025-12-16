'use client';

import React, { useCallback } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WritingSessionListItemSchema } from '@/lib/schema/writing-session.schema';
import { cn, getLevelColor } from '@/lib/utils';

import { format } from 'date-fns';
import { Calendar, CheckCircle2, Clock, Play, Trash2 } from 'lucide-react';

interface SessionCardProps {
  session: WritingSessionListItemSchema;
  onDelete?: (sessionId: number) => void;
  isDeleting?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete, isDeleting }) => {
  const router = useRouter();
  const isCompleted = session.status === 'completed';

  const handleContinue = useCallback(() => {
    router.push(`/topic/${session.id}`);
  }, [session.id, router]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Bạn có chắc chắn muốn xóa phiên học này?')) {
        onDelete?.(session.id);
      }
    },
    [session.id, onDelete]
  );

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border py-0 transition-all',
        isCompleted
          ? 'to-background border-success from-success-foreground/10 dark:from-success-foreground/20 bg-gradient-to-br'
          : 'border-border/50 from-background to-muted/20 hover:border-primary/50 bg-gradient-to-br'
      )}
    >
      {/* Status Indicator */}
      <div className={cn('absolute top-0 left-0 h-full w-1', isCompleted ? 'bg-success' : '')} />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex w-full items-center justify-between">
              <h4 className="text-foreground group-hover:text-primary mb-2 truncate text-lg font-bold transition-colors">
                {session.topic}
              </h4>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Calendar className="size-3.5" />
                  <span>{format(new Date(session.created_at), 'dd/MM/yyyy')}</span>
                </div>
                <Button
                  variant="error-outline"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="size-8"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn('border font-semibold', getLevelColor(session.level))}
              >
                {session.level}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'border font-medium',
                  isCompleted
                    ? 'border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="mr-1 size-3" />
                    Hoàn thành
                  </>
                ) : (
                  <>
                    <Clock className="mr-1 size-3" />
                    Đang học
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          {!isCompleted && (
            <Button className="w-full" onClick={handleContinue}>
              <Play />
              Tiếp tục
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SessionCard;
