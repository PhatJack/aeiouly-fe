'use client';

import React, { useRef, useState } from 'react';

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
    return <LoadingWithText text="Đang tải dữ liệu..." />;
  }

  return (
    <div ref={contentRef} className="flex flex-col gap-4 xl:h-[calc(100vh-2rem)]">
      <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
        {/* Left side - Chat */}
        <ChatSection sessionId={Number(id)} className="flex-1" />

        {/* Right side - Details */}
        <div className="w-full xl:w-[40%]">
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
