'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import PracticeInput from '@/components/app/gym/detail/PracticeInput';
import ProgressNavigation from '@/components/app/gym/detail/ProgressNavigation';
import TranslationCard from '@/components/app/gym/detail/TranslationCard';
import VideoControls from '@/components/app/gym/detail/VideoControls';
import VideoPlayer from '@/components/app/gym/detail/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetLessonDetailQuery, useGetNextSentenceMutation } from '@/services/listening-session';

import { toast } from 'sonner';

interface GymDetailPageProps {
  id?: string;
}

const GymDetailPage = ({ id }: GymDetailPageProps) => {
  const router = useRouter();
  const lessonId = Number(id);

  // Fetch lesson details
  const {
    data: lesson,
    isLoading,
    isError,
  } = useGetLessonDetailQuery(lessonId, {
    refetchOnWindowFocus: false,
  });
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Mutations

  const getNextSentenceMutation = useGetNextSentenceMutation();

  const currentSentence = lesson?.sentences[currentSentenceIndex];

  // Memoized handlers
  const handleCheck = useCallback(() => {
    if (!currentSentence) return;

    const userText = userInput.trim().toLowerCase();
    const correctText = currentSentence.original_text.trim().toLowerCase();

    if (userText === correctText) {
      toast.success('Chính xác! 🎉');
      handleNext();
    } else {
      toast.error('Chưa đúng, hãy thử lại!');
    }
  }, [currentSentence, userInput]);

  const handleNext = useCallback(() => {
    if (!lesson || !id) return;

    if (currentSentenceIndex < lesson.sentences.length - 1) {
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
  }, [lesson, id, currentSentenceIndex, getNextSentenceMutation, router]);

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
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      <div className="py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Side - Video Section */}
          <div className="space-y-4">
            <VideoPlayer lesson={lesson} showVideo={showVideo} onToggleVideo={handleToggleVideo} />

            <VideoControls showVideo={showVideo} onToggleVideo={handleToggleVideo} />
          </div>

          {/* Right Side - Practice Interface */}
          <div className="space-y-4">
            <ProgressNavigation
              currentIndex={currentSentenceIndex}
              totalSentences={lesson.sentences.length}
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
            {currentSentence && (
              <TranslationCard
                translation={currentSentence.vietnamese_translation}
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
