'use client';

import React, { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import VocabularyFlashcardSection from '@/components/app/vocabulary/VocabularyFlashcardSection';
import VocabularyItemCard from '@/components/app/vocabulary/VocabularyItemCard';
import VocabularyQuizSection from '@/components/app/vocabulary/VocabularyQuizSection';
import AlertCustom from '@/components/custom/AlertCustom';
import PaginationCustom from '@/components/custom/PaginationCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FlashcardResponseSchema,
  MultipleChoiceQuestionSchema,
} from '@/lib/schema/vocabulary.schema';
import {
  useCreateFlashcardSessionMutation,
  useCreateMultipleChoiceSessionMutation,
  useGetVocabularyItemsQuery,
  useGetVocabularySetQuery,
  useRemoveVocabularyItemMutation,
} from '@/services/vocabulary';

import { ArrowLeft, BookOpen, BrainCircuit, Layers, WholeWord } from 'lucide-react';
import { toast } from 'sonner';

interface VocabularyDetailPageProps {
  id: string;
}

const VocabularyDetailPage = ({ id }: VocabularyDetailPageProps) => {
  const router = useRouter();
  const t = useTranslations('vocabulary');
  const [page, setPage] = useState(1);
  const setId = Number(id);
  const [quizQuestions, setQuizQuestions] = useState<MultipleChoiceQuestionSchema[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardResponseSchema[] | null>(null);
  const [showFlashcardMode, setShowFlashcardMode] = useState(false);

  const { data: vocabularySetData, isLoading: isLoadingSet } = useGetVocabularySetQuery(setId);
  const { data: vocabularyItemsData, isLoading: isLoadingItems } = useGetVocabularyItemsQuery(
    setId,
    {
      page,
    }
  );

  const removeItemMutation = useRemoveVocabularyItemMutation();
  const createFlashcardMutation = useCreateFlashcardSessionMutation();
  const createMultipleChoiceMutation = useCreateMultipleChoiceSessionMutation();

  const handleRemoveItem = (itemId: number) => {
    if (confirm(t('detail.confirmRemove'))) {
      removeItemMutation.mutate(itemId, {
        onSuccess: () => {
          toast.success(t('detail.success.remove'));
        },
        onError: (error) => {
          toast.error(error.detail || t('detail.error.remove'));
        },
      });
    }
  };

  const handleFlashcardPractice = () => {
    createFlashcardMutation.mutate(
      { vocabulary_set_id: setId, max_items: 20 },
      {
        onSuccess: (data) => {
          setFlashcards(data.cards);
          setShowFlashcardMode(true);
          toast.success(t('detail.success.flashcardCreated', { count: data.cards.length }));
        },
        onError: (error) => {
          toast.error(error.detail || t('detail.error.practice'));
        },
      }
    );
  };

  const handleMultipleChoicePractice = () => {
    createMultipleChoiceMutation.mutate(
      { vocabulary_set_id: setId, max_items: 20 },
      {
        onSuccess: (data) => {
          setQuizQuestions(data.questions);
          setSelectedAnswers({});
          setShowResults(false);
          setShowQuizMode(true);
          toast.success(t('detail.success.quizCreated', { count: data.questions.length }));
        },
        onError: (error) => {
          toast.error(error.detail || t('detail.error.practice'));
        },
      }
    );
  };

  const handleAnswerSelect = useCallback((questionIndex: number, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  }, []);

  const handleSubmitQuiz = useCallback(() => {
    setShowResults(true);
    toast.success(t('detail.success.submitted'));
  }, [t]);

  const handleBackToList = useCallback(() => {
    setShowQuizMode(false);
    setQuizQuestions(null);
    setSelectedAnswers({});
    setShowResults(false);
    setShowFlashcardMode(false);
    setFlashcards(null);
  }, []);

  if (isLoadingSet) {
    return (
      <div className="container mx-auto max-w-5xl space-y-6 p-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!vocabularySetData) {
    return (
      <div className="container mx-auto max-w-5xl p-4">
        <Card className="dark:bg-card/50 dark:border-border/30 dark:backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <h2 className="text-foreground mb-4 text-2xl font-bold dark:text-white">
              {t('detail.notFound')}
            </h2>
            <Button
              onClick={() => router.push('/vocabulary')}
              className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              {t('detail.back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = vocabularyItemsData?.pages || 1;
  const totalItems = vocabularyItemsData?.total || 0;

  return (
    <div className="container mx-auto max-w-5xl space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={() =>
            showQuizMode || showFlashcardMode ? handleBackToList() : router.push('/vocabulary')
          }
          className="dark:hover:bg-accent/50"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-3xl font-bold dark:text-white">
              {vocabularySetData.name}
            </h1>
            {vocabularySetData.is_default && (
              <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full px-3 py-1 text-sm font-medium">
                {t('detail.default')}
              </span>
            )}
          </div>
          {vocabularySetData.description && (
            <p className="text-muted-foreground mt-2 dark:text-gray-400">
              {vocabularySetData.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1">
            <span className="bg-primary dark:bg-primary/90 size-6 rounded-full p-1">
              <WholeWord className="h-4 w-4 text-white" />
            </span>
            <span className="text-foreground text-base font-medium dark:text-white">
              {vocabularySetData.total_words}
            </span>
            <span className="text-muted-foreground dark:text-gray-400">{t('detail.words')}</span>
          </div>
        </div>
      </div>
      {!showQuizMode && !showFlashcardMode && (
        <>
          <AlertCustom variant={'warning'} title={t('detail.note')} />
          {/* Practice Buttons */}
          {totalItems > 0 && (
            <div className="grid gap-4">
              {/* Flashcard Practice */}
              <Button
                size={'lg'}
                disabled={createFlashcardMutation.isPending}
                onClick={handleFlashcardPractice}
                className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                <Layers className="text-primary-foreground h-6 w-6 dark:text-white" />
                <h3 className="font-semibold">{t('detail.practice.flashcard')}</h3>
              </Button>

              {/* Multiple Choice Practice */}
              <Button
                variant="secondary-outline"
                size={'lg'}
                disabled={createMultipleChoiceMutation.isPending}
                onClick={handleMultipleChoicePractice}
                className="dark:border-secondary/50 dark:bg-secondary/10 dark:text-secondary dark:hover:bg-secondary/20"
              >
                <BrainCircuit className="text-secondary h-6 w-6" />
                <h3 className="font-semibold">{t('detail.practice.multipleChoice')}</h3>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Flashcard Section */}
      {showFlashcardMode && flashcards && (
        <div className="relative">
          <VocabularyFlashcardSection cards={flashcards} />
          <Card className="mt-4">
            <CardContent className="text-center">
              <Button
                onClick={handleBackToList}
                size="lg"
                className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                {t('detail.backToList')}
              </Button>
            </CardContent>
          </Card>
          {createFlashcardMutation.isPending && (
            <LoadingWithText
              text={t('detail.loading.flashcard')}
              className="bg-background absolute inset-0 size-full backdrop-blur-sm"
            />
          )}
        </div>
      )}

      {/* Quiz Section */}
      {showQuizMode && quizQuestions && (
        <div className="relative">
          <VocabularyQuizSection
            questions={quizQuestions}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmitQuiz}
            showResults={showResults}
          />
          {showResults && (
            <Card>
              <CardContent className="text-center">
                <Button
                  onClick={handleBackToList}
                  size="lg"
                  className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                >
                  {t('detail.backToList')}
                </Button>
              </CardContent>
            </Card>
          )}
          {createMultipleChoiceMutation.isPending && (
            <LoadingWithText
              text={t('detail.loading.quiz')}
              className="bg-background absolute inset-0 size-full backdrop-blur-sm"
            />
          )}
        </div>
      )}

      {/* Vocabulary Items */}
      {!showQuizMode &&
        !showFlashcardMode &&
        (isLoadingItems ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : vocabularyItemsData && vocabularyItemsData.items.length > 0 ? (
          <>
            <div className="space-y-4">
              {vocabularyItemsData.items.map((item) => (
                <VocabularyItemCard key={item.id} item={item} onRemove={handleRemoveItem} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <PaginationCustom
                  currentPage={page}
                  totalPages={vocabularyItemsData?.pages || 1}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="dark:bg-card/50 dark:border-border/30 dark:backdrop-blur-sm">
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center py-12">
              <BookOpen className="text-muted-foreground mb-4 h-16 w-16 dark:text-gray-500" />
              <h3 className="text-foreground mb-2 text-lg font-semibold dark:text-white">
                {t('detail.empty.title')}
              </h3>
              <p className="text-muted-foreground text-center dark:text-gray-400">
                {t('detail.empty.description')}
              </p>
            </CardContent>
          </Card>
        ))}

      {/* Loading Overlays */}
      {removeItemMutation.isPending && (
        <LoadingWithText
          text={t('detail.loading.remove')}
          className="fixed inset-0 z-50 bg-black/20"
        />
      )}
    </div>
  );
};

export default VocabularyDetailPage;
