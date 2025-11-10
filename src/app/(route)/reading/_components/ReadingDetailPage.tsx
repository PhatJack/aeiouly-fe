'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useRouter } from 'nextjs-toploader/app';

import QuizSection from '@/components/app/reading/QuizSection';
import SummaryFeedback from '@/components/app/reading/SummaryFeedback';
import SummarySubmissionForm from '@/components/app/reading/SummarySubmissionForm';
import AlertCustom from '@/components/custom/AlertCustom';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import TextSelectionModal from '@/components/shared/TextSelectionModal';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useContentTextSelection from '@/hooks/use-text-selection';
import {
  QuizGenerationRequestSchema,
  QuizQuestionSchema,
  SummaryFeedbackSchema,
  SummarySubmissionSchema,
} from '@/lib/schema/reading-session.schema';
import {
  useGenerateQuizMutation,
  useGetReadingSessionDetailQuery,
  useSubmitSummaryMutation,
} from '@/services/reading-session';
import { useBlockNavigation } from '@/stores/use-block-navigation';

import { ArrowLeft, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingDetailPageProps {
  id: string;
}

const ReadingDetailPage = ({ id }: ReadingDetailPageProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const selection = useContentTextSelection({
    ref: contentRef,
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const sessionId = Number(id);
  const setUnsaved = useBlockNavigation((state) => state.setUnsaved);
  const [summarySubmitted, setSummarySubmitted] = useState(false);
  const [feedback, setFeedback] = useState<SummaryFeedbackSchema | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestionSchema[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const {
    data: session,
    isLoading,
    isError,
  } = useGetReadingSessionDetailQuery(sessionId, {
    refetchOnWindowFocus: false,
  });
  const submitSummaryMutation = useSubmitSummaryMutation();
  const generateQuizMutation = useGenerateQuizMutation();

  const handleSummarySubmit = useCallback(
    (data: SummarySubmissionSchema) => {
      setUnsaved(false);
      submitSummaryMutation.mutate(
        { sessionId, data },
        {
          onSuccess: (result) => {
            setFeedback(result);
            setSummarySubmitted(true);
            toast.success('Đã nộp bài tóm tắt thành công!');
          },
          onError: () => {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
          },
        }
      );
    },
    [sessionId, submitSummaryMutation]
  );

  const handleGenerateQuiz = useCallback(
    (data: QuizGenerationRequestSchema) => {
      generateQuizMutation.mutate(
        { sessionId, data },
        {
          onSuccess: (result) => {
            setQuiz(result.questions);
            setSelectedAnswers({});
            toast.success('Đã tạo bài trắc nghiệm!');
          },
          onError: () => {
            toast.error('Có lỗi xảy ra khi tạo bài trắc nghiệm.');
          },
        }
      );
    },
    [sessionId, generateQuizMutation]
  );

  const handleAnswerSelect = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const checkQuizAnswers = useCallback(() => {
    if (!quiz) return;

    let correct = 0;
    quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer.correct_option) {
        correct++;
      }
    });

    toast.success(`Bạn trả lời đúng ${correct}/${quiz.length} câu hỏi!`);
  }, [quiz, selectedAnswers]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-6 h-12 w-48" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Không tìm thấy phiên đọc</h2>
            <Button onClick={() => router.push('/reading')}>Quay lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card/50 z-10 border-b backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/reading')}
                className="h-10 w-10"
                data-navigation
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{session.topic}</h1>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    {session.level}
                  </Badge>
                  <span>•</span>
                  <span>{session.genre}</span>
                  <span>•</span>
                  <span>{session.word_count} từ</span>
                  {session.is_custom && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="bg-amber-50 text-xs text-amber-700">
                        Tự chọn
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl space-y-4 py-4">
        {/* Reading Content */}
        <AlertCustom
          variant={'info'}
          icon={<CircleAlert />}
          title="Bạn có thể bôi đen từ để lưu lại và học thêm"
        />
        <Card>
          <CardContent ref={contentRef}>
            <BlockquoteCustom
              variants="primary"
              title="Nội dung bài đọc"
              content={
                <div className="max-w-none">
                  <ReactMarkdown>{session.content}</ReactMarkdown>
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Summary Submission */}
        {!summarySubmitted && !feedback && (
          <SummarySubmissionForm
            onSubmit={handleSummarySubmit}
            isPending={submitSummaryMutation.isPending}
          />
        )}

        {/* Summary Feedback */}
        {feedback && (
          <SummaryFeedback
            feedback={feedback}
            showQuizForm={!quiz}
            onGenerateQuiz={handleGenerateQuiz}
            isGenerating={generateQuizMutation.isPending}
          />
        )}

        {/* Quiz Section */}
        {quiz && (
          <QuizSection
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            isLoading={generateQuizMutation.isPending}
            onAnswerSelect={handleAnswerSelect}
            onCheckAnswers={checkQuizAnswers}
          />
        )}
      </div>
      {selection.isSelected && selection.position && (
        <TextSelectionModal selection={selection} tooltipRef={tooltipRef} setOpen={setOpen} />
      )}
      <VocabularyDialog
        textSelection={selection.persistedText}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default ReadingDetailPage;
