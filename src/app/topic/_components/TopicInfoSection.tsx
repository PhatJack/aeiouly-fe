'use client';

import React, { memo } from 'react';

import EndSessionButton from '@/components/app/topic/EndSessionButton';
import HintButton from '@/components/app/topic/HintButton';
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
    <div className="border-border/50 relative flex w-1/2 flex-col overflow-hidden rounded-2xl border bg-gray-50">
      <div className="flex h-full flex-col items-center justify-between pb-16">
        <div className="w-full overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 divide-x border-b bg-white">
            <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">Chủ đề:</span>
              <p className="text-success font-medium">{writingSession.topic}</p>
            </div>
            <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">Độ khó:</span>
              <p className="text-error font-medium">{writingSession.level}</p>
            </div>
            <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">Tổng số câu:</span>
              <p className="text-info font-medium">{writingSession.total_sentences}</p>
            </div>
          </div>
          <div className="space-y-4 px-4 pt-2 pb-4">
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
            <HintButton id={writingSession.id} />
          </div>
        </div>
        <div className="absolute bottom-0 z-40 w-full border-t bg-gray-50 p-4">
          <EndSessionButton id={writingSession.id} />
        </div>
      </div>
    </div>
  );
};

export default memo(TopicInfoSection);
