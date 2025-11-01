'use client';

import React, { memo } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  QuizGenerationRequestSchema,
  quizGenerationRequestSchema,
} from '@/lib/schema/reading-session.schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Brain, CheckCircle, Lightbulb } from 'lucide-react';

interface SummaryFeedbackProps {
  feedback: { score: number; feedback: string };
  showQuizForm: boolean;
  onGenerateQuiz: (data: QuizGenerationRequestSchema) => void;
  isGenerating: boolean;
}

const SummaryFeedback = ({
  feedback,
  showQuizForm,
  onGenerateQuiz,
  isGenerating,
}: SummaryFeedbackProps) => {
  const quizForm = useForm({
    resolver: zodResolver(quizGenerationRequestSchema),
    defaultValues: {
      number_of_questions: 5,
    },
  });

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="text-primary h-5 w-5" />
          Đánh giá bài tóm tắt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
            <span className="text-primary text-2xl font-bold">{feedback.score}</span>
          </div>
          <div className="flex-1">
            <h3 className="mb-1 font-semibold">Điểm số</h3>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${feedback.score}%` }}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Lightbulb className="h-4 w-4" />
            Nhận xét
          </h3>
          <p className="text-muted-foreground leading-relaxed">{feedback.feedback}</p>
        </div>

        {showQuizForm && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Brain className="h-4 w-4" />
                Tiếp tục luyện tập
              </h3>
              <Form {...quizForm}>
                <form
                  onSubmit={quizForm.handleSubmit(onGenerateQuiz)}
                  className="flex items-end gap-4"
                >
                  <FormField
                    control={quizForm.control}
                    name="number_of_questions"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Số câu hỏi (3-10)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={3}
                            max={10}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? 'Đang tạo...' : 'Tạo bài trắc nghiệm'}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(SummaryFeedback);
