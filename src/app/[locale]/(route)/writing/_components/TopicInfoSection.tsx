'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import EndSessionButton from '@/components/app/topic/EndSessionButton';
import HintButton from '@/components/app/topic/HintButton';
import SkipSentenceButton from '@/components/app/topic/SkipSentenceButton';
import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WritingSessionContext } from '@/contexts/WritingSessionContext';
import { WritingSessionResponseSchema } from '@/lib/schema/writing-session.schema';

import { useContextSelector } from 'use-context-selector';

interface TopicInfoSectionProps {
  writingSession: WritingSessionResponseSchema;
}

const TopicInfoSection = ({ writingSession }: TopicInfoSectionProps) => {
  const t = useTranslations('writing');
  const searchParams = useSearchParams();
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
    <div className="border-border/50 dark:bg-background relative flex flex-col overflow-hidden rounded-2xl border bg-gray-50 xl:w-1/2">
      <div className="flex h-full flex-col items-center justify-between pb-16">
        <ScrollArea className="w-full overflow-y-auto">
          {/* Stats Grid */}
          <div className="dark:bg-muted grid grid-cols-2 gap-2 divide-x border-b bg-white">
            {/* <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">Chủ đề:</span>
              <p className="text-success font-medium line-clamp-1" title={writingSession.topic}>{writingSession.topic}</p>
            </div> */}
            <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">{t('topicDetail.difficulty')}:</span>
              <p className="text-error font-medium" title={writingSession.level}>
                {writingSession.level}
              </p>
            </div>
            <div className="flex items-center space-x-1 p-4">
              <span className="text-muted-foreground">{t('topicDetail.totalSentences')}:</span>
              <p className="text-info font-medium" title={String(writingSession.total_sentences)}>
                {writingSession.total_sentences}
              </p>
            </div>
          </div>
          <div className="space-y-4 px-4 pt-2 pb-4">
            <BlockquoteCustom
              title={t('topicDetail.topic')}
              content={<p title={writingSession.topic}>{writingSession.topic}</p>}
              variants="warning"
            />

            {/* Full Text */}
            <BlockquoteCustom
              title={t('topicDetail.fullText')}
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
              title={t('topicDetail.currentSentence')}
              content={
                <div className="text-base leading-relaxed">
                  {writingSession.vietnamese_sentences[currentSentenceIndex]}
                </div>
              }
              variants="success"
            />
            <SkipSentenceButton id={writingSession.id} />
            <HintButton id={writingSession.id} currentSentenceIndex={currentSentenceIndex} />
          </div>
        </ScrollArea>
        <div className="dark:bg-background absolute bottom-0 z-40 w-full border-t bg-gray-50 p-4">
          <EndSessionButton
            id={writingSession.id}
            lid={searchParams.get('lid') ? Number(searchParams.get('lid')) : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(TopicInfoSection);
