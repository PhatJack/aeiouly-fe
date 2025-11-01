'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizQuestionSchema } from '@/lib/schema/reading-session.schema';

import { Brain } from 'lucide-react';

interface QuizSectionProps {
  quiz: QuizQuestionSchema[];
  selectedAnswers: Record<string, string>;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onCheckAnswers: () => void;
}

const QuizSection = ({
  quiz,
  selectedAnswers,
  onAnswerSelect,
  onCheckAnswers,
}: QuizSectionProps) => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-primary h-5 w-5" />
          Bài trắc nghiệm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <h3 className="font-semibold">
              Câu {index + 1}: {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <button
                  key={optIndex}
                  onClick={() => onAnswerSelect(question.id, option)}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                    selectedAnswers[question.id] === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswers[question.id] && (
              <div
                className={`rounded-lg p-3 ${
                  selectedAnswers[question.id] === question.correct_answer.correct_option
                    ? 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                    : 'border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                }`}
              >
                <p className="mb-1 font-medium">
                  {selectedAnswers[question.id] === question.correct_answer.correct_option
                    ? '✅ Chính xác!'
                    : '❌ Chưa đúng'}
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>Đáp án đúng:</strong> {question.correct_answer.correct_option}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  <strong>Giải thích:</strong> {question.correct_answer.explanation}
                </p>
              </div>
            )}
          </div>
        ))}

        {Object.keys(selectedAnswers).length === quiz.length && (
          <Button onClick={onCheckAnswers} className="w-full">
            Kiểm tra kết quả
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(QuizSection);
