'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import { LearningPathFormSchema } from '@/lib/schema/learning-path.schema';
import {
  useCreateLearningPathMutation,
  useGetLearningPathStatusQuery,
  useGetMyLearningPathQuery,
} from '@/services/learning-path';

import StudyRouteForm from './StudyRouteForm';
import StudyRouteTimeline from './StudyRouteTimeline';

const StudyRoutePage = () => {
  const t = useTranslations('studyRoute');
  const [showTimeline, setShowTimeline] = useState(false);
  const createLearningPathMutation = useCreateLearningPathMutation();
  const [learningPathId, setLearningPathId] = useState<number | undefined>(undefined);
  const { isLoading, data: learningPathStatus } = useGetLearningPathStatusQuery(learningPathId);
  const {
    data: learningPath,
    isLoading: isLearningPathLoading,
    error,
    refetch,
  } = useGetMyLearningPathQuery({
    enabled: !showTimeline,
    retry: (failureCount, error: any) => {
      if (error?.detail === t('errors.noStudyRoute')) return false;
      return failureCount < 3;
    },
  });

  const handleFormSubmit = useCallback((data: LearningPathFormSchema) => {
    createLearningPathMutation.mutate(data, {
      onSuccess: (data) => {
        setLearningPathId(data.id);
      },
    });
  }, []);

  useEffect(() => {
    if (learningPath?.id) {
      setShowTimeline(true);
    }
  }, [learningPath]);

  if (isLearningPathLoading) {
    return <LoadingWithText text={t('loading.loadingStudyRoute')} />;
  }

  if (!learningPath || error?.detail === t('errors.noStudyRoute') || !showTimeline) {
    return (
      <div className="mx-auto max-w-xl">
        <StudyRouteForm
          onSubmit={handleFormSubmit}
          status={learningPathStatus}
          isLoading={isLoading || createLearningPathMutation.isPending}
          onViewRoute={() => {
            refetch();
          }}
        />
      </div>
    );
  }

  return (
    <StudyRouteTimeline learningPath={learningPath} onDeleteRoute={() => setShowTimeline(false)} />
  );
};

export default StudyRoutePage;
