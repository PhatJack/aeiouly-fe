'use client';

import React, { memo, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuizQuestionSchema } from '@/lib/schema/reading-session.schema';
import { cn } from '@/lib/utils';

import { Brain, CheckCircle2, Languages, XCircle } from 'lucide-react';

interface QuizSectionProps {
  quiz: QuizQuestionSchema[];
  selectedAnswers: Record<number, number>;
  onAnswerSelect: (questionIndex: number, optionIndex: number) => void;
  isLoading?: boolean;
}

const QuizSection = ({ quiz, selectedAnswers, onAnswerSelect, isLoading }: QuizSectionProps) => {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'vi'>('en');

  if (isLoading) {
    return <LoadingWithText text="Đang tạo bài trắc nghiệm..." />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 dark:text-white">
            <Brain className="text-primary h-5 w-5" />
            Bài trắc nghiệm
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'Tiếng Anh' : 'Tiếng Việt'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((question, questionIndex) => {
          const currentQuestion = language === 'en' ? question.questionEn : question.questionVi;
          const currentOptions = language === 'en' ? question.optionsEn : question.optionsVi;
          const currentExplanation =
            language === 'en' ? question.explanationEn : question.explanationVi;
          const isAnswered = selectedAnswers[questionIndex] !== undefined;
          const isCorrect = selectedAnswers[questionIndex] === question.correctAnswer;

          return (
            <div key={questionIndex} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary dark:bg-primary/20 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {questionIndex + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-foreground text-base leading-relaxed font-semibold dark:text-white">
                    {currentQuestion}
                  </h3>

                  <div className="space-y-2">
                    {currentOptions.map((option, optIndex) => {
                      const isSelected = selectedAnswers[questionIndex] === optIndex;
                      const showCorrect = isAnswered && optIndex === question.correctAnswer;
                      const showIncorrect = isAnswered && isSelected && !isCorrect;

                      return (
                        <button
                          key={optIndex}
                          onClick={() => onAnswerSelect(questionIndex, optIndex)}
                          disabled={isAnswered}
                          className={cn(
                            `w-full rounded-lg border-2 p-2 text-left transition-all ${
                              showCorrect
                                ? 'border-success bg-success/10 dark:bg-success/20'
                                : showIncorrect
                                  ? 'border-error bg-error/10 dark:bg-error/20'
                                  : isSelected
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'border-border hover:border-primary/50 dark:border-border/50 dark:hover:border-primary/50'
                            } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {showCorrect && (
                              <span>
                                <CheckCircle2 className="text-success" />
                              </span>
                            )}
                            {showIncorrect && (
                              <span>
                                <XCircle className="text-error" />
                              </span>
                            )}
                            <span
                              className={
                                showCorrect
                                  ? 'text-success font-medium'
                                  : showIncorrect
                                    ? 'text-error font-medium'
                                    : ''
                              }
                            >
                              {option}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`rounded-lg border p-3 ${
                        isCorrect
                          ? 'border-success/30 bg-success/10 dark:bg-success/20'
                          : 'border-error/30 bg-error/10 dark:bg-error/20'
                      }`}
                    >
                      <p className="mb-2 flex items-center gap-1 font-medium">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="text-success inline" />
                            <span>Chính xác!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="text-error inline" />
                            <span>Chưa đúng</span>
                          </>
                        )}
                      </p>
                      <p className="text-muted-foreground text-sm dark:text-gray-300">
                        <strong>Giải thích:</strong> {currentExplanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {Object.keys(selectedAnswers).length === quiz.length && (
          <div className="w-full space-y-2">
            <Separator />
            <h3 className="mb-2 text-lg font-semibold">Kết quả tổng quát:</h3>
            <p className="text-foreground dark:text-white">
              Bạn đã trả lời đúng{' '}
              {
                Object.values(selectedAnswers).filter((ans, idx) => ans === quiz[idx].correctAnswer)
                  .length
              }{' '}
              trên {quiz.length} câu hỏi.
            </p>
            <Button className="w-full" size={'lg'} type="button" onClick={() => router.back()}>
              Thoát
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(QuizSection);
