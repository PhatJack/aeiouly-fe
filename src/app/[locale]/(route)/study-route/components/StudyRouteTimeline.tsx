'use client';

import React, { memo, useCallback } from 'react';

import { useTranslations } from 'next-intl';

import AlertCustom from '@/components/custom/AlertCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
} from '@/components/ui/timeline';
import { LearningPathResponseSchema } from '@/lib/schema/learning-path.schema';
import { StudyRouteRoutine } from '@/lib/schema/study-route.schema';
import { cn } from '@/lib/utils';
import { useDeleteMyLearningPathMutation } from '@/services/learning-path';

import { CircleAlert } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

import StudyRouteTimelineItem from './StudyRouteTimelineItem';

interface StudyRouteTimelineProps {
  learningPath: LearningPathResponseSchema | undefined;
  onDeleteRoute?: () => void;
}

const DateDisplay = memo(({ planDuration }: { planDuration?: StudyRouteRoutine }) => {
  const t = useTranslations('studyRoute.timeline.duration');
  if (!planDuration) return null;

  return <span className="text-primary font-bold">{t(planDuration)}</span>;
});
DateDisplay.displayName = 'DateDisplay';

const StudyRouteTimeline = ({ learningPath, onDeleteRoute }: StudyRouteTimelineProps) => {
  const t = useTranslations('studyRoute.timeline');
  const deleteLearningPathMutation = useDeleteMyLearningPathMutation();

  const handleDeleteLearningPath = useCallback(() => {
    deleteLearningPathMutation.mutate(undefined, {
      onSuccess: () => {
        if (onDeleteRoute) {
          onDeleteRoute();
        }
      },
    });
  }, [deleteLearningPathMutation, onDeleteRoute]);

  if (!learningPath || !learningPath.daily_plans) {
    return (
      <EmptyCustom icon="book-open" title={t('empty.title')} description={t('empty.description')} />
    );
  }
  return (
    <div className="mx-auto w-full space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {t('title')} <DateDisplay planDuration={learningPath.form_data?.planDuration} />{' '}
          {t('ofYou')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <AlertCustom variant={'info'} title={t('alert')} icon={<CircleAlert />} />
      <Timeline>
        {learningPath.daily_plans.map((day) => {
          const isCompleted = day.lessons.every((lesson) => lesson.status === 'done');
          const hasInProgress = day.lessons.some((lesson) => lesson.status === 'in_progress');
          const isPending = day.status === 'pending';

          return (
            <TimelineItem key={day.id}>
              <TimelineDot variant={isCompleted ? 'success' : 'primary'}>
                <Button
                  className={`flex size-8 items-center justify-center rounded-full ${
                    isCompleted ? 'bg-success' : 'bg-primary'
                  }`}
                >
                  {isCompleted ? (
                    <DynamicIcon name="check" className="size-4 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-white">{day.day_number}</span>
                  )}
                </Button>
              </TimelineDot>
              <TimelineContent>
                <TimelineHeading>
                  {hasInProgress && `${t('inProgressPrefix')} `}
                  {t('dayPrefix')} {day.day_number}
                </TimelineHeading>
                <div className="relative mt-4 space-y-3">
                  {isPending && (
                    <EmptyCustom
                      icon={<DynamicIcon name="lock" className="text-muted-foreground" />}
                      title={t('locked.title')}
                      description={t('locked.description')}
                      className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
                    />
                  )}
                  <div className={cn(isPending ? 'pointer-events-none blur-sm' : '', 'space-y-3')}>
                    {day.lessons.map((lesson) => (
                      <StudyRouteTimelineItem
                        key={lesson.id}
                        lesson={lesson}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="error" className="w-full" size={'lg'}>
            {t('delete.button')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete.confirmDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLearningPath}>
              {t('delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
StudyRouteTimeline.displayName = 'StudyRouteTimeline';
export default memo(StudyRouteTimeline);
