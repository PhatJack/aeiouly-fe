'use client';

import React from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SessionResponseSchema } from '@/lib/schema/listening-session.schema';

import { Play, RotateCcw } from 'lucide-react';

interface ListeningSessionsListProps {
  sessions: SessionResponseSchema[];
  onContinueSession: (sessionId: number) => void;
}

const ListeningSessionsList = ({ sessions, onContinueSession }: ListeningSessionsListProps) => {
  const router = useRouter();

  if (sessions.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Play className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Chưa có phiên học nào</h3>
        <p className="text-muted-foreground">
          Bắt đầu học bằng cách chọn một bài học từ danh sách bên dưới
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => {
        const progress = Math.round(
          (session.current_sentence_index / session.lesson.total_sentences) * 100
        );

        return (
          <Card key={session.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
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
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ</span>
                  <span className="font-medium">
                    {session.current_sentence_index}/{session.lesson.total_sentences}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onContinueSession(session.id)}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    {session.status === 'active' ? 'Tiếp tục' : 'Xem lại'}
                  </Button>
                  {session.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/gym/${session.id}?restart=true`)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ListeningSessionsList;
