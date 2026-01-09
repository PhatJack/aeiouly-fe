'use client';

import React, { useCallback, useState } from 'react';

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
    if (confirm('Bạn có chắc chắn muốn xóa từ này khỏi bộ từ vựng?')) {
      removeItemMutation.mutate(itemId, {
        onSuccess: () => {
          toast.success('Đã xóa từ khỏi bộ từ vựng!');
        },
        onError: (error) => {
          toast.error(error.detail || 'Có lỗi xảy ra khi xóa từ');
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
          toast.success(`Đã tạo ${data.cards.length} thẻ flashcard!`);
        },
        onError: (error) => {
          toast.error(error.detail || 'Có lỗi xảy ra khi tạo phiên luyện tập');
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
          toast.success(`Đã tạo ${data.questions.length} câu hỏi trắc nghiệm!`);
        },
        onError: (error) => {
          toast.error(error.detail || 'Có lỗi xảy ra khi tạo phiên luyện tập');
        },
      }
    );
  };

  const handleAnswerSelect = useCallback((questionIndex: number, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionId }));
  }, []);

  const handleSubmitQuiz = useCallback(() => {
    setShowResults(true);
    toast.success('Đã nộp bài!');
  }, []);

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
              Không tìm thấy bộ từ vựng
            </h2>
            <Button
              onClick={() => router.push('/vocabulary')}
              className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              Quay lại
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
                Mặc định
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
            <span className="text-muted-foreground dark:text-gray-400">từ</span>
          </div>
        </div>
      </div>
      {!showQuizMode && !showFlashcardMode && (
        <>
          <AlertCustom
            variant={'warning'}
            title="Chú ý: bạn được học tối đa 20 từ mới một ngày. Đây là lượng từ phù hợp để bạn có thể học hiệu quả."
          />
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
                <h3 className="font-semibold">Luyện tập với Flashcard</h3>
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
                <h3 className="font-semibold">Luyện tập Multiple Choice</h3>
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
                Quay lại danh sách từ
              </Button>
            </CardContent>
          </Card>
          {createFlashcardMutation.isPending && (
            <LoadingWithText
              text="Đang tạo flashcard..."
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
                  Quay lại danh sách từ
                </Button>
              </CardContent>
            </Card>
          )}
          {createMultipleChoiceMutation.isPending && (
            <LoadingWithText
              text="Đang tạo bài trắc nghiệm..."
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
                Chưa có từ vựng nào
              </h3>
              <p className="text-muted-foreground text-center dark:text-gray-400">
                Thêm từ vựng vào bộ từ này để bắt đầu học
              </p>
            </CardContent>
          </Card>
        ))}

      {/* Loading Overlays */}
      {removeItemMutation.isPending && (
        <LoadingWithText text="Đang xóa..." className="fixed inset-0 z-50 bg-black/20" />
      )}
    </div>
  );
};

export default VocabularyDetailPage;
