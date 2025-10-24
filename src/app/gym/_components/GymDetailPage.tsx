'use client';

import React, { useCallback, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import PracticeInput from '@/components/app/gym/detail/PracticeInput';
import ProgressNavigation from '@/components/app/gym/detail/ProgressNavigation';
import TranslationCard from '@/components/app/gym/detail/TranslationCard';
import VideoControls from '@/components/app/gym/detail/VideoControls';
import VideoPlayer from '@/components/app/gym/detail/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetLessonDetailQuery,
  useGetListeningSessionQuery,
  useGetNextSentenceMutation,
} from '@/services/listening-session';

import { toast } from 'sonner';

interface GymDetailPageProps {
  id?: string;
}

const GymDetailPage = ({ id }: GymDetailPageProps) => {
  const router = useRouter();
  const lessonId = Number(id);

  const {
    data: listeningSession,
    isLoading,
    isError,
  } = useGetListeningSessionQuery(lessonId, {
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  // Mutations

  const getNextSentenceMutation = useGetNextSentenceMutation();

  // Memoized handlers
  const handleCheck = useCallback(() => {
    // const userText = userInput.trim().toLowerCase();
    // const correctText = listeningSession.lesson.sentences[currentSentenceIndex].original_text.trim().toLowerCase();
  }, [userInput]);

  const handleNext = useCallback(() => {
    if (!listeningSession || !id) return;

    if (currentSentenceIndex < listeningSession.lesson.total_sentences - 1) {
      getNextSentenceMutation.mutate(Number(id), {
        onSuccess: (data) => {
          setCurrentSentenceIndex(data.current_sentence_index);
          setUserInput('');
          setShowTranslation(false);
        },
      });
    } else {
      toast.success('Hoàn thành bài học! 🎊');
      router.push('/gym');
    }
  }, [listeningSession, id, currentSentenceIndex, getNextSentenceMutation, router]);

  const handleSkip = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handlePrevious = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1);
      setUserInput('');
      setShowTranslation(false);
    }
  }, [currentSentenceIndex]);

  const handleToggleVideo = useCallback(() => {
    setShowVideo((prev) => !prev);
  }, []);

  const handleToggleTranslation = useCallback(() => {
    setShowTranslation((prev) => !prev);
  }, []);

  const handleBack = useCallback(() => {
    router.push('/gym');
  }, [router]);

  const handleInputChange = useCallback((value: string) => {
    setUserInput(value);
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !listeningSession) {
    return (
      <div>
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Không tìm thấy bài học</h2>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Side - Video Section */}
          <div className="space-y-4">
            <VideoPlayer
              session={listeningSession}
              showVideo={showVideo}
              onToggleVideo={handleToggleVideo}
            />

            <VideoControls showVideo={showVideo} onToggleVideo={handleToggleVideo} />
          </div>

          {/* Right Side - Practice Interface */}
          <div className="space-y-4">
            <ProgressNavigation
              currentIndex={currentSentenceIndex}
              totalSentences={listeningSession.lesson.total_sentences}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />

            <PracticeInput
              value={userInput}
              onChange={handleInputChange}
              onCheck={handleCheck}
              onSkip={handleSkip}
            />

            {/* Translation */}
            {listeningSession.current_sentence && (
              <TranslationCard
                translation={listeningSession.current_sentence?.vietnamese_translation || ''}
                showTranslation={showTranslation}
                onToggle={handleToggleTranslation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymDetailPage;
