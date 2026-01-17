import React from 'react';

import { useTranslations } from 'next-intl';

import { Progress } from '@/components/ui/progress';
import { FinalEvaluationResponseSchema } from '@/lib/schema/writing-session.schema';
import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface FinalEvaluationProps {
  data: FinalEvaluationResponseSchema;
  onClose?: () => void;
}

const FinalEvaluation = ({ data }: FinalEvaluationProps) => {
  const t = useTranslations('writing');

  return (
    <div className="space-y-6 py-4">
      {/* Overall Score */}
      <div className="border-border bg-card rounded-lg border p-6 text-center">
        <p className="text-muted-foreground mb-2 text-sm">{t('evaluation.overallScore.title')}</p>
        <p className={`text-5xl font-bold ${getScoreColor(data.overall_score)}`}>
          {data.overall_score}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">{getScoreLabel(data.overall_score)}</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('evaluation.progress.title')}</span>
          <span className="font-medium">
            {t('evaluation.progress.completed', {
              completed: data.completed_sentences,
              total: data.total_sentences,
            })}
          </span>
        </div>
        <Progress value={(data.completed_sentences / data.total_sentences) * 100} className="h-2" />
      </div>

      {/* Detailed Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('evaluation.detailedScores.title')}</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: t('evaluation.detailedScores.accuracy'), score: data.accuracy_score },
            { label: t('evaluation.detailedScores.fluency'), score: data.fluency_score },
            { label: t('evaluation.detailedScores.vocabulary'), score: data.vocabulary_score },
            { label: t('evaluation.detailedScores.grammar'), score: data.grammar_score },
          ].map((item) => (
            <div key={item.label} className="border-border bg-card rounded-lg border p-4">
              <p className="text-muted-foreground mb-2 text-sm">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
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
          <h3 className="text-lg font-semibold">{t('evaluation.feedback.title')}</h3>
          <div className="border-border dark:bg-background rounded-lg border bg-white p-4">
            <p className="text-sm leading-relaxed">{data.feedback}</p>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t('evaluation.suggestions.title')}</h3>
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
          {t('evaluation.completedAt')}{' '}
          {new Date(data.completed_at).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
};

export default FinalEvaluation;
