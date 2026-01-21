'use client';

import React, { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import TextSelectionModal from '@/components/shared/TextSelectionModal';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import useTextSelection from '@/hooks/use-text-selection';
import { useGetWritingSessionQuery } from '@/services/writing-session';

import ChatSection from './ChatSection';
import TopicInfoSection from './TopicInfoSection';

interface TopicDetailPageProps {
  id: string;
}

const TopicDetailPage = ({ id }: TopicDetailPageProps) => {
  const t = useTranslations('writing');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const selection = useTextSelection({
    ref: contentRef,
  });
  const [open, setOpen] = useState<boolean>(false);
  const { data: writingSession, isLoading } = useGetWritingSessionQuery(Number(id), {
    refetchOnWindowFocus: false,
  });

  if (isLoading || !writingSession) {
    return <LoadingWithText text={t('topicDetail.loading')} />;
  }

  return (
    <div
      ref={contentRef}
      className="flex flex-col gap-4 xl:h-[calc(100vh-5.75rem-1px)] xl:max-h-full"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        {/* Left side - Chat */}
        <ChatSection sessionId={Number(id)} className="order-2 flex-1 sm:order-1" />

        {/* Right side - Topic Details */}
        <TopicInfoSection writingSession={writingSession} className="order-1 sm:order-2" />
      </div>
      {selection.isSelected && selection.position && (
        <TextSelectionModal selection={selection} tooltipRef={tooltipRef} setOpen={setOpen} />
      )}
      <VocabularyDialog
        textSelection={selection.persistedText}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default TopicDetailPage;
