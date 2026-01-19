import React, { memo, useCallback } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ROUTE } from '@/configs/route';
import { LessonWithProgressResponseSchema } from '@/lib/schema/learning-path.schema';
import { cn, getLevelColor } from '@/lib/utils';
import { useStartLessonMutation } from '@/services/learning-path';
import { useCreateListeningSessionMutation } from '@/services/listening-session/create-listening-session.api';
import { useCreateReadingSessionMutation } from '@/services/reading-session/create-reading-session.api';
import { useCreateSpeakingSessionMutation } from '@/services/speaking-session/create-speaking-session.api';
import { useCreateWritingSessionMutation } from '@/services/writing-session/create-writing-session.api';

import { DynamicIcon } from 'lucide-react/dynamic';
import { toast } from 'sonner';

import { getSkillIcon } from '../utils/util';

const getStatusTextClient = (status: string, t: any) => {
  switch (status) {
    case 'done':
      return t('status.completed');
    case 'in_progress':
      return t('status.inProgress');
    default:
      return t('status.start');
  }
};

const getGenderTextClient = (gender: string, t: any) => {
  switch (gender) {
    case 'male':
      return t('gender.male');
    case 'female':
      return t('gender.female');
    default:
      return t('gender.unknown');
  }
};

interface StudyRouteTimelineItemProps {
  lesson: LessonWithProgressResponseSchema;
  isPending?: boolean;
}

const StudyRouteTimelineItem = ({ lesson, isPending }: StudyRouteTimelineItemProps) => {
  const t = useTranslations('studyRoute');
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
            toast.error(t('errors.missingLessonInfo'));
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
            router.push(`${ROUTE.GYM}/${listeningSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`${ROUTE.GYM}/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
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
            router.push(
              `${ROUTE.READING}/${readingSession.id}?source=study-route&lid=${lesson.id}`
            );
          } else {
            router.push(
              `${ROUTE.READING}/${lesson.session_id}?source=study-route&lid=${lesson.id}`
            );
          }
          break;

        case 'speaking':
          if (!my_character || !ai_character || !ai_gender || !scenario || !level) {
            toast.error(t('errors.missingLessonInfo'));
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
            router.push(`${ROUTE.ONION}/${speakingSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`${ROUTE.ONION}/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        case 'writing':
          if (!topic || !level || !total_sentences) {
            toast.error(t('errors.missingLessonInfo'));
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
            router.push(`${ROUTE.TOPIC}/${writingSession.id}?source=study-route&lid=${lesson.id}`);
          } else {
            router.push(`${ROUTE.TOPIC}/${lesson.session_id}?source=study-route&lid=${lesson.id}`);
          }
          break;

        default:
          toast.error(t('errors.invalidLessonType'));
      }
    } catch (error: any) {
      toast.error(error?.message || t('errors.createSessionError'));
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
          text={t('errors.creatingSession')}
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
                <span className="font-semibold">{t('lessonDetails.genre')}</span>{' '}
                {lesson.config.genre}
              </p>
            )}
            {lesson.config.topic && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">{t('lessonDetails.topic')}</span>{' '}
                {lesson.config.topic}
              </p>
            )}
            {(lesson.config.my_character || lesson.config.ai_character) && (
              <div className="flex flex-col gap-1">
                {lesson.config.my_character && (
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold">{t('lessonDetails.myCharacter')}</span>{' '}
                    {lesson.config.my_character}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  {lesson.config.ai_character && (
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold">{t('lessonDetails.aiCharacter')}</span>{' '}
                      {lesson.config.ai_character}
                    </p>
                  )}
                  {lesson.config.ai_character && lesson.config.ai_gender && (
                    <Separator orientation="vertical" className="h-4" />
                  )}
                  {lesson.config.ai_gender && (
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold">{t('lessonDetails.aiGender')}</span>{' '}
                      {getGenderTextClient(lesson.config.ai_gender, t)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {lesson.config.scenario && (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold">{t('lessonDetails.scenario')}</span>{' '}
                {lesson.config.scenario}
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
          {getStatusTextClient(lesson.status, t)}
        </Button>
      </div>
    </div>
  );
};

export default memo(StudyRouteTimelineItem);
