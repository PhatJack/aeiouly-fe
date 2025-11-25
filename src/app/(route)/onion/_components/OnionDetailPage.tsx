'use client';

import React, { useRef, useState } from 'react';

import LoadingWithText from '@/components/LoadingWithText';
import DetailRightPanel from '@/components/app/onion/DetailRightPanel';
import TextSelectionModal from '@/components/shared/TextSelectionModal';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import { useRecorder } from '@/hooks/use-recorder';
import useTextSelection from '@/hooks/use-text-selection';
import { cn } from '@/lib/utils';
import { useGetSpeakingSessionQuery } from '@/services/speaking-session';

import { Mic, Pause } from 'lucide-react';

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
    <div ref={contentRef} className="flex h-[calc(100vh-3rem)] w-full gap-6">
      <div className="relative flex size-full flex-col lg:w-3/5"></div>
      <div className="w-full lg:w-2/5">
        <DetailRightPanel />
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
