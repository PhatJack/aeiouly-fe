import React, { memo, useCallback } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LessonWithProgressResponseSchema } from '@/lib/schema/learning-path.schema';
import { cn, getLevelColor } from '@/lib/utils';
import { useStartLessonMutation } from '@/services/learning-path';
import { useCreateListeningSessionMutation } from '@/services/listening-session/create-listening-session.api';
import { useCreateReadingSessionMutation } from '@/services/reading-session/create-reading-session.api';
import { useCreateSpeakingSessionMutation } from '@/services/speaking-session/create-speaking-session.api';
import { useCreateWritingSessionMutation } from '@/services/writing-session/create-writing-session.api';

import { DynamicIcon } from 'lucide-react/dynamic';
import { toast } from 'sonner';

import { getGenderText, getSkillIcon, getStatusText } from '../utils/util';

interface StudyRouteTimelineItemProps {
  lesson: LessonWithProgressResponseSchema;
  isPending?: boolean;
}

const StudyRouteTimelineItem = ({ lesson, isPending }: StudyRouteTimelineItemProps) => {
  const router = useRouter();
  const skillIcon = getSkillIcon(lesson.config.lesson_type);
  const isCompleted = lesson.status === 'done';
  const isInProgress = lesson.status === 'in_progress';

  const startLessonMutation = useStartLessonMutation();
  const createListeningSession = useCreateListeningSessionMutation({
    meta: {
      ignoreGlobal: true,
    },
  });
  const createReadingSession = useCreateReadingSessionMutation({
    meta: {
      ignoreGlobal: true,
    },
  });
  const createSpeakingSession = useCreateSpeakingSessionMutation({
    meta: {
      ignoreGlobal: true,
    },
  });
  const createWritingSession = useCreateWritingSessionMutation({
    meta: {
      ignoreGlobal: true,
    },
  });

  const isLoading =
    createListeningSession.isPending ||
    createReadingSession.isPending ||
    createSpeakingSession.isPending ||
    createWritingSession.isPending;

  const handleStartLesson = useCallback(async () => {
    try {
      const {
        lesson_type,
        lesson_id,
        topic,
        level,
        genre,
        word_count,
        total_sentences,
        scenario,
        my_character,
        ai_character,
        ai_gender,
      } = lesson.config;

      switch (lesson_type) {
        case 'listening':
          if (!lesson_id) {
            toast.error('Thiếu thông tin bài học');
            return;
          }
          if (!lesson.session_id) {
            const listeningSession = await createListeningSession.mutateAsync({
              lesson_id,
            });
            await startLessonMutation.mutateAsync({
              userLessonProgressId: lesson.id || 0,
              data: { session_id: listeningSession.id },
            });
            router.push(`/listening/${listeningSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`/listening/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        case 'reading':
          if (!lesson.session_id) {
            const readingSession = await createReadingSession.mutateAsync({
              level: level,
              genre: genre,
              word_count: word_count || undefined,
              topic: topic || undefined,
            });
            await startLessonMutation.mutateAsync({
              userLessonProgressId: lesson.id || 0,
              data: { session_id: readingSession.id },
            });
            router.push(`/reading/${readingSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`/reading/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        case 'speaking':
          if (!my_character || !ai_character || !ai_gender || !scenario || !level) {
            toast.error('Thiếu thông tin bài học');
            return;
          }
          if (!lesson.session_id) {
            const speakingSession = await createSpeakingSession.mutateAsync({
              my_character,
              ai_character,
              ai_gender,
              scenario,
              level,
            });
            await startLessonMutation.mutateAsync({
              userLessonProgressId: lesson.id || 0,
              data: { session_id: speakingSession.id },
            });
            router.push(`/speaking/${speakingSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`/speaking/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        case 'writing':
          if (!topic || !level || !total_sentences) {
            toast.error('Thiếu thông tin bài học');
            return;
          }
          if (!lesson.session_id) {
            const writingSession = await createWritingSession.mutateAsync({
              topic,
              level,
              total_sentences,
            });
            await startLessonMutation.mutateAsync({
              userLessonProgressId: lesson.id || 0,
              data: { session_id: writingSession.id },
            });
            router.push(`/writing/${writingSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`/writing/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        default:
          toast.error('Loại bài học không hợp lệ');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi tạo bài học');
    }
  }, [
    lesson,
    createListeningSession,
    createReadingSession,
    createSpeakingSession,
    createWritingSession,
    router,
  ]);

  return (
    <div
      key={lesson.id}
      className={`relative overflow-hidden rounded-lg border p-3 ${
        isCompleted
          ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
          : isInProgress
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card'
      }`}
    >
      {isLoading && (
        <LoadingWithText
          text="Đang tạo phiên học"
          className="bg-background absolute inset-0 z-50 size-full backdrop-blur-sm"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <Button size={'icon'} variant={'outline'}>
            <DynamicIcon
              name={skillIcon}
              className={cn(
                'size-4',
                isInProgress && lesson.config.lesson_type === 'reading'
                  ? 'text-primary'
                  : lesson.config.lesson_type === 'speaking'
                    ? 'text-success'
                    : lesson.config.lesson_type === 'writing'
                      ? 'text-violet-500'
                      : 'text-blue-500'
              )}
            />
          </Button>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium capitalize">{lesson.config.lesson_type}</h4>
              {lesson.config.level != null && (
                <Badge variant="outline" className={getLevelColor(lesson.config.level || '')}>
                  Level: {lesson.config.level}
                </Badge>
              )}
            </div>
            <h5 className="font-medium capitalize">{lesson.title}</h5>
            {lesson.config.genre && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Thể loại:</span> {lesson.config.genre}
              </p>
            )}
            {lesson.config.topic && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Chủ đề:</span> {lesson.config.topic}
              </p>
            )}
            {(lesson.config.my_character || lesson.config.ai_character) && (
              <div className="flex flex-col gap-1">
                {lesson.config.my_character && (
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold">Nhân vật của tôi:</span>{' '}
                    {lesson.config.my_character}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  {lesson.config.ai_character && (
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold">Nhân vật AI:</span>{' '}
                      {lesson.config.ai_character}
                    </p>
                  )}
                  <Separator orientation="vertical" className="h-4" />
                  {lesson.config.ai_gender && (
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold">Giới tính AI:</span>{' '}
                      {getGenderText(lesson.config.ai_gender)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {lesson.config.scenario && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">Bối cảnh:</span> {lesson.config.scenario}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant={isCompleted ? 'success' : 'default'}
          disabled={isCompleted || isLoading || isPending}
          onClick={handleStartLesson}
          className="shrink-0"
        >
          {isCompleted && <DynamicIcon name="check-circle-2" className="size-4" />}
          {getStatusText(lesson.status)}
        </Button>
      </div>
    </div>
  );
};

export default memo(StudyRouteTimelineItem);
