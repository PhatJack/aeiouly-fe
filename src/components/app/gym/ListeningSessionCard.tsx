import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SessionResponseSchema } from '@/lib/schema/listening-session.schema';

import { Play, Trash2 } from 'lucide-react';

interface ListeningSessionCardProps {
  session: SessionResponseSchema;
  onContinueSession: (sessionId: number) => void;
  onDeleteLesson: (id: number) => void;
}

const ListeningSessionCard = memo(
  ({ session, onContinueSession, onDeleteLesson }: ListeningSessionCardProps) => {
    const progress = Math.round(
      (session.current_sentence_index / session.lesson.total_sentences) * 100
    );
    return (
      <>
        <Card className="justify-between py-4 transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="line-clamp-2 text-base">{session.lesson.title}</CardTitle>
                <CardDescription className="text-sm">
                  Cấp độ {session.lesson.level} • {session.lesson.total_sentences} câu
                </CardDescription>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  session.status === 'active'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}
              >
                {session.status === 'active' ? 'Đang học' : 'Hoàn thành'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-medium">
                  {session.current_sentence_index}/{session.lesson.total_sentences}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-2">
                <Button className="flex-1" onClick={() => onContinueSession(session.id)}>
                  <Play className="mr-1 h-4 w-4" />
                  {session.status === 'active' ? 'Tiếp tục' : 'Học lại'}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => onDeleteLesson(session.id)}
                  aria-label={`Xóa phiên #${session.id}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
);
ListeningSessionCard.displayName = 'ListeningSessionCard';
export default ListeningSessionCard;
