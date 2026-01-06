'use client';

import React, { memo, useCallback } from 'react';

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
import { useDeleteMyLearningPathMutation } from '@/services/learning-path';

import { CircleAlert } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

import StudyRouteTimelineItem from './StudyRouteTimelineItem';

interface StudyRouteTimelineProps {
  learningPath: LearningPathResponseSchema | undefined;
  onDeleteRoute?: () => void;
}

const DateDisplay = memo(({ planDuration }: { planDuration?: StudyRouteRoutine }) => {
  if (!planDuration) return null;

  return (
    <span className="text-primary font-bold">
      {planDuration === '7_days' ? '7 ngày' : planDuration === '30_days' ? '30 ngày' : '90 ngày'}
    </span>
  );
});
DateDisplay.displayName = 'DateDisplay';

const StudyRouteTimeline = ({ learningPath, onDeleteRoute }: StudyRouteTimelineProps) => {
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
      <EmptyCustom
        icon="book-open"
        title="Lộ trình học tập trống"
        description="Hiện tại bạn chưa có lộ trình học tập nào. Vui lòng tạo lộ trình để bắt đầu học tập."
      />
    );
  }
  return (
    <div className="mx-auto w-full space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Lộ trình học tiếng Anh <DateDisplay planDuration={learningPath.form_data?.planDuration} />{' '}
          của bạn
        </h1>
        <p className="text-muted-foreground">
          Hoàn thành các hoạt động học tập theo thứ tự để đạt hiệu quả tốt nhất
        </p>
      </div>
      <AlertCustom
        variant={'info'}
        title="Bạn chỉ được phép tạo mỗi lần 1 lộ trình."
        icon={<CircleAlert />}
      />
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
                  {hasInProgress && 'Đang học: '}
                  Ngày {day.day_number}
                </TimelineHeading>
                <div className="relative mt-4 space-y-3">
                  {isPending && (
                    <EmptyCustom
                      icon={<DynamicIcon name="lock" className="text-muted-foreground" />}
                      title="Ngày học bị khoá"
                      description="Hoàn thành các bài học trước để mở khoá"
                      className="absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
                    />
                  )}
                  <div className={isPending ? 'pointer-events-none blur-sm' : 'space-y-3'}>
                    {day.lessons.map((lesson) => (
                      <StudyRouteTimelineItem key={lesson.id} lesson={lesson} />
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
            Xoá lộ trình
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xoá lộ trình này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả tiến trình học tập của bạn trong lộ trình này
              sẽ bị xoá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLearningPath}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
StudyRouteTimeline.displayName = 'StudyRouteTimeline';
export default memo(StudyRouteTimeline);
