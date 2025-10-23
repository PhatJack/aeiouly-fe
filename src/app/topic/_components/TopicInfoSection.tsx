'use client';

import React from 'react';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { WritingSessionResponseSchema } from '@/lib/schema/writing-session.schema';

interface TopicInfoSectionProps {
  writingSession: WritingSessionResponseSchema;
}

const TopicInfoSection = ({ writingSession }: TopicInfoSectionProps) => {
  const text = writingSession.vietnamese_text;
  const current = writingSession.current_sentence;

  const highlighted =
    text && current
      ? text.replace(
          current,
          `<mark class="bg-transparent text-primary font-medium">${current}</mark>`
        )
      : text;

  return (
    <div className="border-border/50 flex w-md flex-col rounded-2xl border bg-gray-50 p-6 backdrop-blur-sm">
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
              {writingSession.vietnamese_sentences[writingSession.current_sentence_index]}
            </div>
          }
          variants="success"
        />

        {/* Progress */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-medium">
              {writingSession.current_sentence_index + 1} / {writingSession.total_sentences}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${((writingSession.current_sentence_index + 1) / writingSession.total_sentences) * 100}%`,
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TopicInfoSection;
