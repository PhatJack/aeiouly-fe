'use client';

import React, { useCallback, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useRouter } from 'nextjs-toploader/app';

import InputChecker from '@/components/app/gym/detail/InputChecker';
import ProgressNavigation from '@/components/app/gym/detail/ProgressNavigation';
import VideoControls from '@/components/app/gym/detail/VideoControls';
import VideoPlayer from '@/components/app/gym/detail/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetListeningSessionQuery,
  useGetNextSentenceMutation,
} from '@/services/listening-session';
import { useGymDetailStore } from '@/stores/gym-detail.store';

import { Play } from 'lucide-react';
import { toast } from 'sonner';

interface GymDetailPageProps {
  id?: string;
}

const GymDetailPage = ({ id }: GymDetailPageProps) => {
  const router = useRouter();
  const lessonId = Number(id);

  // Zustand store
  const {
    session,
    isStarted,
    currentSentenceIndex,
    showVideo,
    showTranslation,
    setSession,
    startLearning,
    setCurrentSentenceIndex,
    toggleVideo,
    toggleTranslation,
    handlePlay,
    setIsPlaying,
    reset,
    setPlayTrigger,
  } = useGymDetailStore();

  const {
    data: listeningSession,
    isLoading,
    isError,
  } = useGetListeningSessionQuery(lessonId, {
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const getNextSentenceMutation = useGetNextSentenceMutation();

  useEffect(() => {
    if (listeningSession) {
      setSession(listeningSession);
      setCurrentSentenceIndex(listeningSession.current_sentence_index);
    }
  }, [listeningSession, setSession]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Memoized handlers
  const handleCheckResult = useCallback((result: { detailed: any }) => {}, []);

  const handleNext = useCallback(() => {
    if (!session || !id) return;

    if (currentSentenceIndex < session.lesson.total_sentences - 1) {
      getNextSentenceMutation.mutate(Number(id), {
        onSuccess: (data) => {
          setCurrentSentenceIndex(data.current_sentence_index);
        },
      });
    } else {
      toast.success('Hoàn thành bài học! 🎊');
      router.push('/gym');
    }
  }, [session, id, currentSentenceIndex, getNextSentenceMutation, router, setCurrentSentenceIndex]);

  const handlePrevious = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  }, [currentSentenceIndex, setCurrentSentenceIndex]);

  const handleToggleVideo = useCallback(() => {
    toggleVideo();
  }, [toggleVideo]);

  const handleToggleTranslation = useCallback(() => {
    toggleTranslation();
  }, [toggleTranslation]);

  const handleBack = useCallback(() => {
    router.push('/gym');
  }, [router]);

  const handleStartLearning = useCallback(() => {
    startLearning();
    setPlayTrigger();
    setIsPlaying(true);
  }, [startLearning]);

  const handlePlayVideo = useCallback(() => {
    handlePlay();
    setPlayTrigger();
    setIsPlaying(true);
  }, [setPlayTrigger, setIsPlaying]);

  useHotkeys('space', () => {
    handlePlayVideo();
  });

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

  if (isError || !session) {
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
      <div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <VideoPlayer />

            <VideoControls showVideo={showVideo} onToggleVideo={handleToggleVideo} />
          </div>

          {/* Right Side - Practice Interface */}
          <div className="space-y-4">
            {!isStarted ? (
              // Start Learning Button
              <div className="flex h-full min-h-[400px] items-center justify-center">
                <div className="space-y-6 text-center">
                  <div className="from-primary to-secondary mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Sẵn sàng bắt đầu?</h3>
                    <p className="text-muted-foreground">
                      Nhấp vào nút bên dưới để bắt đầu bài học và nghe câu đầu tiên
                    </p>
                  </div>
                  <Button size="lg" onClick={handleStartLearning} className="px-8 py-3 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Bắt đầu học
                  </Button>
                </div>
              </div>
            ) : (
              // Practice Interface
              <>
                <ProgressNavigation
                  currentIndex={currentSentenceIndex}
                  totalSentences={session.lesson.total_sentences}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onPlay={handlePlayVideo}
                />

                {session.current_sentence && (
                  <InputChecker
                    sentence={session.current_sentence}
                    onResult={handleCheckResult}
                    onNext={handleNext}
                    isLoading={getNextSentenceMutation.isPending}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymDetailPage;
