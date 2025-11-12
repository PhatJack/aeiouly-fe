'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';

import LoadingWithText from '@/components/LoadingWithText';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  DiscussionQuestionSchema,
  EvaluateAnswerResponseSchema,
} from '@/lib/schema/reading-session.schema';

import { Languages, Loader2, MessageSquare } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

interface DiscussionSectionProps {
  questions: DiscussionQuestionSchema[];
  isLoading?: boolean;
  onEvaluateAnswer: (questionId: string, question: string, answer: string) => void;
  evaluating?: Record<string, boolean>;
  feedback?: Record<string, EvaluateAnswerResponseSchema>;
}

const DiscussionSection = ({
  questions,
  isLoading,
  onEvaluateAnswer,
  evaluating = {},
  feedback = {},
}: DiscussionSectionProps) => {
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleEvaluate = (questionId: string, question: string) => {
    const answer = answers[questionId] || '';
    if (answer.trim()) {
      onEvaluateAnswer(questionId, question, answer);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card dark:border-border/30 dark:bg-card/80">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card dark:border-border/30 dark:bg-card/80 transition-all dark:backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 dark:text-white">
            <MessageSquare className="h-5 w-5" />
            Câu hỏi thảo luận
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'Tiếng Anh' : 'Tiếng Việt'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, index) => (
          <div key={`question-${index}`} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary dark:bg-primary/20 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-foreground text-base leading-relaxed font-medium dark:text-white">
                  {language === 'en' ? q.questionEn : q.questionVi}
                </p>

                <Textarea
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answers[q.questionEn] || ''}
                  onChange={(e) => handleAnswerChange(q.questionEn, e.target.value)}
                  rows={4}
                  className="dark:bg-card/50 resize-none dark:text-gray-200"
                  disabled={evaluating[q.questionEn]}
                />

                <Button
                  onClick={() =>
                    handleEvaluate(q.questionEn, language === 'en' ? q.questionEn : q.questionVi)
                  }
                  disabled={!answers[q.questionEn]?.trim() || evaluating[q.questionEn]}
                  size="sm"
                  className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                >
                  {evaluating[q.questionEn] ? (
                    <>
                      <LoadingWithText text="Đang phân tích..." />
                    </>
                  ) : (
                    'Phân tích câu'
                  )}
                </Button>

                {feedback[q.questionEn] && (
                  <div className="border-border/50 bg-muted/50 dark:border-border/30 dark:bg-card/30 space-y-2 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground text-sm font-semibold dark:text-gray-400">
                        Điểm số:
                      </div>
                      <div className="text-primary text-lg font-bold">
                        {feedback[q.questionEn].score}/100
                      </div>
                    </div>
                    <BlockquoteCustom
                      variants="info"
                      title="Nhận xét"
                      content={
                        <Markdown remarkPlugins={[remarkBreaks]}>
                          {feedback[q.questionEn].feedback.replace(/\\n/g, '\n')}
                        </Markdown>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DiscussionSection;
