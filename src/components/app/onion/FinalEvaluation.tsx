import React from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Progress } from '@/components/ui/progress';
import { FinalEvaluationResponseSchema } from '@/lib/schema/speaking-session.schema';
import { getScoreColor, getScoreLabel, getLocaleTag } from '@/lib/utils';

interface FinalEvaluationProps {
  data: FinalEvaluationResponseSchema;
  onClose?: () => void;
}

const FinalEvaluation = ({ data, onClose }: FinalEvaluationProps) => {
  const t = useTranslations('speaking');
  const locale = useLocale();

  return (
    <div className="space-y-6 py-4">
      {/* Overall Score */}
      <div className="border-border bg-card rounded-lg border p-6 text-center">
        <p className="text-muted-foreground mb-2 text-sm">{t('evaluation.overallScore')}</p>
        <p className={`text-5xl font-bold ${getScoreColor(data.overall_score)}`}>
          {data.overall_score}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">{getScoreLabel(data.overall_score)}</p>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('evaluation.detailedScores')}</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: t('evaluation.pronunciation'), score: data.pronunciation_score },
            { label: t('evaluation.fluency'), score: data.fluency_score },
            { label: t('evaluation.vocabulary'), score: data.vocabulary_score },
            { label: t('evaluation.grammar'), score: data.grammar_score },
            { label: t('evaluation.interaction'), score: data.interaction_score },
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
          <h3 className="text-lg font-semibold">{t('evaluation.feedback')}</h3>
          <div className="border-border dark:bg-background rounded-lg border bg-white p-4">
            <p className="text-sm leading-relaxed">{data.feedback}</p>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t('evaluation.suggestions')}</h3>
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
          {t('evaluation.completedAt')}:{' '}
          {new Date(data.completed_at).toLocaleString(getLocaleTag(locale), {
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
