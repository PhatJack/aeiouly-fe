'use client';

import React from 'react';
import Markdown from 'react-markdown';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MultipleChoiceQuestionSchema } from '@/lib/schema/vocabulary.schema';

import { CheckCircle2, XCircle } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

interface VocabularyQuizSectionProps {
  questions: MultipleChoiceQuestionSchema[];
  selectedAnswers: Record<number, string>;
  onAnswerSelect: (questionIndex: number, optionId: string) => void;
  onSubmit?: () => void;
  showResults?: boolean;
}

const VocabularyQuizSection = ({
  questions,
  selectedAnswers,
  onAnswerSelect,
  onSubmit,
  showResults = false,
}: VocabularyQuizSectionProps) => {
  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      const selectedOptionId = selectedAnswers[index];
      if (selectedOptionId) {
        const selectedOption = question.options.find((opt) => opt.option_id === selectedOptionId);
        if (selectedOption?.is_correct) {
          correct++;
        }
      }
    });
    return correct;
  };

  const correctCount = showResults ? calculateScore() : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground dark:text-white">Trắc nghiệm từ vựng</CardTitle>
            <div className="flex items-center gap-2">
              {showResults ? (
                <Badge variant="outline" className="text-base">
                  Điểm: {correctCount}/{totalQuestions}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-base">
                  {totalAnswered}/{totalQuestions} câu
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Questions */}
      {questions.map((question, questionIndex) => {
        const selectedOptionId = selectedAnswers[questionIndex];

        return (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary dark:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                      {questionIndex + 1}
                    </span>
                    <h3 className="text-foreground text-xl font-bold dark:text-white">
                      {question.word}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-2 dark:text-gray-400">
                    Chọn nghĩa đúng của từ này
                  </p>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2">
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.option_id;
                const isCorrect = option.is_correct;

                // Determine button styling
                let buttonClass = 'justify-start text-left h-auto py-3 px-4';
                let icon = null;

                if (showResults) {
                  if (isSelected) {
                    if (isCorrect) {
                      buttonClass += ' border-success text-success bg-success/5';
                      icon = <CheckCircle2 className="h-5 w-5 shrink-0" />;
                    } else {
                      buttonClass += ' border-error text-error bg-error/5';
                      icon = <XCircle className="h-5 w-5 shrink-0" />;
                    }
                  } else if (isCorrect) {
                    buttonClass += ' border-success/50 text-success/70 bg-success/5';
                    icon = <CheckCircle2 className="h-5 w-5 shrink-0" />;
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/5';
                }

                return (
                  <Button
                    key={option.option_id}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => !showResults && onAnswerSelect(questionIndex, option.option_id)}
                    disabled={showResults}
                  >
                    <Markdown remarkPlugins={[remarkBreaks]}>
                      {option.text.replace(/\\n/g, '\n')}
                    </Markdown>
                    {icon}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Submit Button */}
      {!showResults && onSubmit && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground dark:text-gray-400">
                Đã trả lời {totalAnswered}/{totalQuestions} câu
              </p>
              <Button
                onClick={onSubmit}
                disabled={totalAnswered < totalQuestions}
                size="lg"
                className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                Nộp bài
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {showResults && (
        <Card className="border-primary dark:border-primary/50">
          <CardContent className="py-6 text-center">
            <h3 className="text-foreground mb-2 text-2xl font-bold dark:text-white">
              Kết quả: {correctCount}/{totalQuestions}
            </h3>
            <p className="text-muted-foreground mb-4 dark:text-gray-400">
              Độ chính xác: {Math.round((correctCount / totalQuestions) * 100)}%
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-success">
                <CheckCircle2 className="mx-auto mb-1 h-6 w-6" />
                <p className="text-sm font-medium">{correctCount} đúng</p>
              </div>
              <div className="text-error">
                <XCircle className="mx-auto mb-1 h-6 w-6" />
                <p className="text-sm font-medium">{totalQuestions - correctCount} sai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VocabularyQuizSection;
