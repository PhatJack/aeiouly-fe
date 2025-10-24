'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  QuizGenerationRequestSchema,
  QuizQuestionSchema,
  SummarySubmissionSchema,
  quizGenerationRequestSchema,
  summarySubmissionSchema,
} from '@/lib/schema/reading-session.schema';
import {
  useGenerateQuizMutation,
  useGetReadingSessionDetailQuery,
  useSubmitSummaryMutation,
} from '@/services/reading-session';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle,
  FileText,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReadingDetailPageProps {
  id: string;
}

const ReadingDetailPage = ({ id }: ReadingDetailPageProps) => {
  const router = useRouter();
  const sessionId = Number(id);

  const [summarySubmitted, setSummarySubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestionSchema[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const { data: session, isLoading, isError } = useGetReadingSessionDetailQuery(sessionId);
  const submitSummaryMutation = useSubmitSummaryMutation();
  const generateQuizMutation = useGenerateQuizMutation();

  const summaryForm = useForm<SummarySubmissionSchema>({
    resolver: zodResolver(summarySubmissionSchema),
    defaultValues: {
      summary: '',
    },
  });

  const quizForm = useForm({
    resolver: zodResolver(quizGenerationRequestSchema),
    defaultValues: {
      number_of_questions: 5,
    },
  });

  const handleSummarySubmit = (data: SummarySubmissionSchema) => {
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
  };

  const handleGenerateQuiz = (data: Record<string, any>) => {
    generateQuizMutation.mutate(
      { sessionId, data: data as QuizGenerationRequestSchema },
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
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const checkQuizAnswers = () => {
    if (!quiz) return;

    let correct = 0;
    quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer.correct_option) {
        correct++;
      }
    });

    toast.success(`Bạn trả lời đúng ${correct}/${quiz.length} câu hỏi!`);
  };

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
      <div className="container mx-auto max-w-4xl px-4 py-8">
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
    <div className="from-background via-background to-primary/5 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="bg-card/50 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/reading')}
                className="h-10 w-10"
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
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Reading Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Nội dung bài đọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown>{session.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Summary Submission */}
        {!summarySubmitted && !feedback && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Viết bài tóm tắt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...summaryForm}>
                <form
                  onSubmit={summaryForm.handleSubmit(handleSummarySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={summaryForm.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tóm tắt của bạn (Tiếng Việt hoặc Tiếng Anh)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Viết tóm tắt nội dung bài đọc (tối thiểu 50 ký tự)..."
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>{field.value?.length || 0} / 2000 ký tự</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={submitSummaryMutation.isPending}>
                    {submitSummaryMutation.isPending ? 'Đang nộp...' : 'Nộp bài tóm tắt'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Summary Feedback */}
        {feedback && (
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

              {/* Generate Quiz Option */}
              {!quiz && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Brain className="h-4 w-4" />
                      Tiếp tục luyện tập
                    </h3>
                    <Form {...quizForm}>
                      <form
                        onSubmit={quizForm.handleSubmit(handleGenerateQuiz)}
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
                        <Button type="submit" disabled={generateQuizMutation.isPending}>
                          {generateQuizMutation.isPending ? 'Đang tạo...' : 'Tạo bài trắc nghiệm'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quiz Section */}
        {quiz && (
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
                        onClick={() => handleAnswerSelect(question.id, option)}
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
                          ? 'border border-green-200 bg-green-50'
                          : 'border border-red-200 bg-red-50'
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
                <Button onClick={checkQuizAnswers} className="w-full">
                  Kiểm tra kết quả
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReadingDetailPage;
