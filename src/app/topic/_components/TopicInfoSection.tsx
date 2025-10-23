'use client';

import React, { memo } from 'react';

import EndSessionButton from '@/components/app/topic/EndSessionButton';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { Button } from '@/components/ui/button';
import { WritingSessionContext } from '@/contexts/WritingSessionContext';
import { WritingSessionResponseSchema } from '@/lib/schema/writing-session.schema';

import { useContextSelector } from 'use-context-selector';

interface TopicInfoSectionProps {
  writingSession: WritingSessionResponseSchema;
}

const TopicInfoSection = ({ writingSession }: TopicInfoSectionProps) => {
  const currentSentenceIndex = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx?.currentSentenceIndex ?? 0
  );
  const text = writingSession.vietnamese_text;
  const current = writingSession.vietnamese_sentences[currentSentenceIndex];

  const highlighted =
    text && current
      ? text.replace(
          current,
          `<mark class="bg-transparent text-primary font-medium">${current}</mark>`
        )
      : text;

  return (
    <div className="border-border/50 flex w-md flex-col rounded-2xl border bg-gray-50 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 divide-x rounded-lg border p-4">
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Chủ đề</span>
              <p className="text-success text-lg font-medium">{writingSession.topic}</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Độ khó</span>
              <p className="text-error text-lg font-medium">{writingSession.difficulty}</p>
            </div>
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Tổng số câu</span>
              <p className="text-info text-lg font-medium">{writingSession.total_sentences}</p>
            </div>
          </div>

          {/* Full Text */}
          <BlockquoteCustom
            title="Đoạn văn"
            content={
              <div
                className="text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlighted || '' }}
              />
            }
            variants="info"
          />

          {/* Current Sentence */}
          <BlockquoteCustom
            title="Câu hiện tại"
            content={
              <div className="text-base leading-relaxed">
                {writingSession.vietnamese_sentences[currentSentenceIndex]}
              </div>
            }
            variants="success"
          />
        </div>
        <div>
          <EndSessionButton id={writingSession.id} />
        </div>
      </div>
    </div>
  );
};

export default memo(TopicInfoSection);
