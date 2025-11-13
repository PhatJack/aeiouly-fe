'use client';

import React, { memo, useState } from 'react';

import LoadingWithText from '@/components/LoadingWithText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizQuestionSchema } from '@/lib/schema/reading-session.schema';

import { Brain, Languages } from 'lucide-react';

interface QuizSectionProps {
  quiz: QuizQuestionSchema[];
  selectedAnswers: Record<number, number>;
  onAnswerSelect: (questionIndex: number, optionIndex: number) => void;
  isLoading?: boolean;
}

const QuizSection = ({ quiz, selectedAnswers, onAnswerSelect, isLoading }: QuizSectionProps) => {
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');

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
                          className={`w-full rounded-lg border-2 p-2 text-left transition-all ${
                            showCorrect
                              ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30'
                              : showIncorrect
                                ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30'
                                : isSelected
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-border hover:border-primary/50 dark:border-border/50 dark:hover:border-primary/50'
                          } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span className="flex items-center gap-2">
                            {showCorrect && (
                              <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                            {showIncorrect && (
                              <span className="text-red-600 dark:text-red-400">✗</span>
                            )}
                            <span
                              className={
                                showCorrect
                                  ? 'font-medium text-green-700 dark:text-green-300'
                                  : showIncorrect
                                    ? 'font-medium text-red-700 dark:text-red-300'
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
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
                      }`}
                    >
                      <p className="mb-2 font-medium">
                        {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}
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
      </CardContent>
    </Card>
  );
};

export default memo(QuizSection);
