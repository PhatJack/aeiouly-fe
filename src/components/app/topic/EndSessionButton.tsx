import React, { memo, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { getScoreColor, getScoreLabel } from '@/lib/utils';
import {
  useCompleteWritingSessionMutation,
  useGetFinalEvaluationQuery,
} from '@/services/writing-session';

import { toast } from 'sonner';

interface EndSessionButtonProps {
  id?: number;
}

const EndSessionButton = ({ id }: EndSessionButtonProps) => {
  const router = useRouter();
  const [showEvaluation, setShowEvaluation] = useState(false);
  const endWritingSession = useCompleteWritingSessionMutation();
  const { data, refetch } = useGetFinalEvaluationQuery(id || 0, {
    enabled: false,
  });

  const handleEndSession = () => {
    if (!id) return;
    endWritingSession.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message || 'Kết thúc phiên học thành công!');
        refetch().then(() => {
          setShowEvaluation(true);
        });
      },
      onError: (error: any) => {
        toast.error(error.message || 'Đã có lỗi xảy ra khi kết thúc phiên học.');
      },
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Kết thúc sớm</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa hoàn thành bài học này?</AlertDialogTitle>
            <AlertDialogDescription>
              Nếu bạn kết thúc sớm, tiến trình hiện tại của bạn sẽ không được lưu lại. Bạn có chắc
              chắn muốn kết thúc không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent className="max-h-[90vh] max-w-3xl min-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Kết quả đánh giá</DialogTitle>
            <DialogDescription>Dưới đây là kết quả chi tiết về phiên học của bạn</DialogDescription>
          </DialogHeader>

          {data && (
            <div className="space-y-6 py-4">
              {/* Overall Score */}
              <div className="border-border bg-card rounded-lg border p-6 text-center">
                <p className="text-muted-foreground mb-2 text-sm">Điểm tổng quan</p>
                <p className={`text-5xl font-bold ${getScoreColor(data.overall_score)}`}>
                  {data.overall_score}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {getScoreLabel(data.overall_score)}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ hoàn thành</span>
                  <span className="font-medium">
                    {data.completed_sentences}/{data.total_sentences} câu
                  </span>
                </div>
                <Progress
                  value={(data.completed_sentences / data.total_sentences) * 100}
                  className="h-2"
                />
              </div>

              {/* Detailed Scores */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chi tiết điểm số</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Độ chính xác', score: data.accuracy_score },
                    { label: 'Độ trôi chảy', score: data.fluency_score },
                    { label: 'Từ vựng', score: data.vocabulary_score },
                    { label: 'Ngữ pháp', score: data.grammar_score },
                  ].map((item) => (
                    <div key={item.label} className="border-border bg-card rounded-lg border p-4">
                      <p className="text-muted-foreground mb-2 text-sm">{item.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </p>
                        <p className="text-muted-foreground text-sm">/ 100</p>
                      </div>
                      <Progress value={item.score} className="mt-2 h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {data.feedback && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Nhận xét</h3>
                  <div className="border-border rounded-lg border bg-white p-4">
                    <p className="text-sm leading-relaxed">{data.feedback}</p>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {data.suggestions && data.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Gợi ý cải thiện</h3>
                  <ul className="space-y-2">
                    {data.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="border-border bg-card flex gap-3 rounded-lg border p-3 text-sm"
                      >
                        <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Completed Time */}
              {data.completed_at && (
                <div className="text-muted-foreground border-t pt-4 text-center text-sm">
                  Hoàn thành lúc:{' '}
                  {new Date(data.completed_at).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => {
                    router.push('/topic');
                    setShowEvaluation(false);
                  }}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Hoàn tất
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default memo(EndSessionButton);
