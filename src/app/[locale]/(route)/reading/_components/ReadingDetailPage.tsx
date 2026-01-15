'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import DiscussionSection from '@/components/app/reading/DiscussionSection';
import QuizSection from '@/components/app/reading/QuizSection';
import AlertCustom from '@/components/custom/AlertCustom';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import TextSelectionModal from '@/components/shared/TextSelectionModal';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useContentTextSelection from '@/hooks/use-text-selection';
import {
  DiscussionQuestionSchema,
  EvaluateAnswerResponseSchema,
  QuizGenerationRequestSchema,
  QuizQuestionSchema,
} from '@/lib/schema/reading-session.schema';
import { useCompleteLessonMutation } from '@/services/learning-path';
import {
  useEvaluateAnswerMutation,
  useGenerateDiscussionMutation,
  useGenerateQuizMutation,
  useGetReadingSessionDetailQuery,
} from '@/services/reading-session';

import { ArrowLeft, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingDetailPageProps {
  id: string;
}

const ReadingDetailPage = ({ id }: ReadingDetailPageProps) => {
  const searchParams = useSearchParams();
  const t = useTranslations('reading');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const selection = useContentTextSelection({
    ref: contentRef,
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const sessionId = Number(id);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [hasReadContent, setHasReadContent] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [discussions, setDiscussions] = useState<DiscussionQuestionSchema[] | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestionSchema[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [evaluating, setEvaluating] = useState<Record<string, boolean>>({});
  const [discussionFeedback, setDiscussionFeedback] = useState<
    Record<string, EvaluateAnswerResponseSchema>
  >({});

  const {
    data: session,
    isLoading,
    isError,
  } = useGetReadingSessionDetailQuery(sessionId, {
    refetchOnWindowFocus: false,
  });

  const generateDiscussionMutation = useGenerateDiscussionMutation();
  const evaluateAnswerMutation = useEvaluateAnswerMutation();
  const generateQuizMutation = useGenerateQuizMutation();
  const completeLessonMutation = useCompleteLessonMutation({
    meta: {
      ignoreGlobal: true,
    },
  });

  const handleGenerateDiscussion = useCallback(() => {
    if (numberOfQuestions < 3 || numberOfQuestions > 10) {
      toast.error(t('detail.content.questionCountError'));
      return;
    }

    generateDiscussionMutation.mutate(
      { sessionId, data: { number_of_questions: numberOfQuestions } },
      {
        onSuccess: (result) => {
          setDiscussions(result.questions);
          setShowOptions(false);
          toast.success(t('discussion.generationSuccess', { count: result.questions.length }));
        },
        onError: () => {
          toast.error(t('discussion.generationError'));
        },
      }
    );
  }, [sessionId, numberOfQuestions, generateDiscussionMutation]);

  const handleEvaluateAnswer = useCallback(
    (questionId: string, question: string, answer: string) => {
      setEvaluating((prev) => ({ ...prev, [questionId]: true }));
      evaluateAnswerMutation.mutate(
        { sessionId, data: { question, answer } },
        {
          onSuccess: (result) => {
            setDiscussionFeedback((prev) => ({ ...prev, [questionId]: result }));
            toast.success(t('discussion.analysisSuccess'));
          },
          onError: (error: any) => {
            if (error?.detail?.[0]?.type === 'string_too_short') {
              toast.error(t('discussion.minLengthError'));
              return;
            }
            toast.error(t('discussion.analysisError'));
          },
          onSettled: () => {
            setEvaluating((prev) => ({ ...prev, [questionId]: false }));
          },
        }
      );
    },
    [sessionId, evaluateAnswerMutation]
  );

  const handleGenerateQuiz = useCallback(() => {
    if (numberOfQuestions < 3 || numberOfQuestions > 10) {
      toast.error(t('detail.content.questionCountError'));
      return;
    }

    generateQuizMutation.mutate(
      { sessionId, data: { number_of_questions: numberOfQuestions } },
      {
        onSuccess: (result) => {
          setQuiz(result.questions);
          setSelectedAnswers({});
          setShowOptions(false);
          toast.success(t('discussion.generationSuccess', { count: result.questions.length }));
        },
        onError: () => {
          toast.error(t('discussion.generationError'));
        },
      }
    );
  }, [sessionId, numberOfQuestions, generateQuizMutation]);

  const handleAnswerSelect = useCallback((questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }, []);

  const handleUnderstandContent = useCallback(() => {
    setHasReadContent(true);
    setShowOptions(true);
  }, []);

  const handleReset = useCallback(() => {
    setDiscussions(null);
    setQuiz(null);
    setSelectedAnswers({});
    setShowOptions(true);
  }, []);

  useEffect(() => {
    if (
      searchParams.get('source') &&
      searchParams.get('lid') &&
      Object.keys(selectedAnswers).length === numberOfQuestions
    ) {
      completeLessonMutation.mutate(Number(searchParams.get('lid')));
    }
  }, [selectedAnswers, numberOfQuestions, sessionId, searchParams]);

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
            <h2 className="mb-4 text-2xl font-bold">{t('detail.notFound.title')}</h2>
            <Button
              onClick={() =>
                router.push(
                  searchParams.get('source') ? `/${searchParams.get('source')}` : '/reading'
                )
              }
            >
              {t('detail.notFound.back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="z-10 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl pb-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(
                    !searchParams.get('source') ? '/reading' : `/${searchParams.get('source')}`
                  )
                }
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
                  <span>{t('session.words', { count: session.word_count })}</span>
                  {session.is_custom && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="bg-amber-50 text-xs text-amber-700">
                        {t('session.customText')}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl space-y-4 py-4">
        {/* Reading Content */}
        <AlertCustom variant={'success'} icon={<CircleAlert />} title={t('detail.highlightTip')} />
        <Card>
          <CardContent ref={contentRef}>
            <BlockquoteCustom
              variants="info"
              title={t('detail.content.title')}
              content={
                <div className="max-w-none">
                  <ReactMarkdown>{session.content}</ReactMarkdown>
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Understand Button */}
        {!hasReadContent && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4 text-base dark:text-gray-300">
                {t('detail.content.instruction')}
              </p>
              <Button
                onClick={handleUnderstandContent}
                size="lg"
                className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                {t('detail.content.understand')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Options Section */}
        {hasReadContent && showOptions && !discussions && !quiz && (
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">
                {t('detail.content.checkComprehension')}
              </CardTitle>
              <p className="text-muted-foreground text-sm dark:text-gray-400">
                {t('detail.content.comprehensionDescription')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions" className="text-sm font-medium">
                  {t('detail.content.numQuestionsLabel')}
                </Label>
                <Input
                  id="numQuestions"
                  type="number"
                  min={3}
                  max={10}
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="dark:bg-card/50"
                  disabled={generateDiscussionMutation.isPending || generateQuizMutation.isPending}
                />
                <p className="text-muted-foreground text-xs dark:text-gray-400">
                  {t('detail.content.numQuestionsHelp')}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateDiscussion}
                  disabled={generateDiscussionMutation.isPending || generateQuizMutation.isPending}
                  size="lg"
                  className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 flex-1"
                >
                  {t('detail.content.generateDiscussion')}
                </Button>
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={generateDiscussionMutation.isPending || generateQuizMutation.isPending}
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                >
                  {t('detail.content.generateQuiz')}
                </Button>
              </div>
            </CardContent>
            {(generateDiscussionMutation.isPending || generateQuizMutation.isPending) && (
              <LoadingWithText
                text={
                  generateDiscussionMutation.isPending
                    ? t('detail.content.generatingDiscussion')
                    : t('detail.content.generatingQuiz')
                }
                className="bg-background absolute inset-0 size-full backdrop-blur-sm"
              />
            )}
          </Card>
        )}

        {/* Discussion Questions */}
        {discussions && (
          <DiscussionSection
            questions={discussions}
            onEvaluateAnswer={handleEvaluateAnswer}
            evaluating={evaluating}
            feedback={discussionFeedback}
          />
        )}

        {/* Quiz Section */}
        {quiz && (
          <QuizSection
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            isLoading={generateQuizMutation.isPending}
            onAnswerSelect={handleAnswerSelect}
          />
        )}
        {(discussions || quiz) && (
          <div className="flex w-full justify-center">
            <Button size={'lg'} className="mt-4" onClick={handleReset}>
              {t('detail.content.practiceAgain')}
            </Button>
          </div>
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
