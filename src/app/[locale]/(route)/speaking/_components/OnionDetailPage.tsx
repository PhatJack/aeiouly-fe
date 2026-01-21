'use client';

import React, { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import DetailRightPanel from '@/components/app/onion/DetailRightPanel';
import TextSelectionModal from '@/components/shared/TextSelectionModal';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import useTextSelection from '@/hooks/use-text-selection';
import { useGetSpeakingSessionQuery } from '@/services/speaking-session';

import ChatSection from './ChatSection';

interface OnionDetailPageProps {
  id: string;
}

const OnionDetailPage = ({ id }: OnionDetailPageProps) => {
  const t = useTranslations('speaking');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const selection = useTextSelection({
    ref: contentRef,
  });
  const [open, setOpen] = useState<boolean>(false);
  const { data: speakingSession, isLoading } = useGetSpeakingSessionQuery(Number(id), {
    refetchOnWindowFocus: false,
  });

  if (isLoading || !speakingSession) {
    return <LoadingWithText text={t('loading')} />;
  }

  return (
    <div
      ref={contentRef}
      className="flex h-full flex-col gap-4 xl:h-[calc(100vh-5.75rem-1px)] xl:max-h-full"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        {/* Left side - Chat */}
        <ChatSection sessionId={Number(id)} className="order-2 flex-1 sm:order-1" />

        {/* Right side - Details */}
        <div className="order-1 w-full sm:order-2 xl:w-[40%]">
          <DetailRightPanel speakingSession={speakingSession} />
        </div>
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

export default OnionDetailPage;
