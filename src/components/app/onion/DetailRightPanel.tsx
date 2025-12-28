'use client';

import React, { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { SpeakingSessionResponseSchema } from '@/lib/schema/speaking-session.schema';

import EndSessionButton from './EndSessionButton';
import HintButton from './HintButton';
import SkipSentenceButton from './SkipSentenceButton';

interface DetailRightPanelProps {
  speakingSession?: SpeakingSessionResponseSchema;
}

const DetailRightPanel = ({ speakingSession }: DetailRightPanelProps) => {
  const searchParams = useSearchParams();
  const { setSelectedVoice } = useSpeechContext();

  useEffect(() => {
    if (speakingSession) {
      setSelectedVoice(
        speakingSession.ai_gender === 'male'
          ? 'Microsoft David - English (United States)'
          : 'Microsoft Zira - English (United States)'
      );
    }
  }, [speakingSession, setSelectedVoice]);

  return (
    <div className="border-border/50 dark:bg-background flex h-full w-full flex-col rounded-2xl border bg-gray-50">
      <div className="dark:bg-muted grid grid-cols-3 gap-2 divide-x rounded-t-2xl border-b">
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">Nhân vật của bạn:</span>
          <p className="text-success font-medium">{speakingSession?.my_character}</p>
        </div>
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">Nhân vật AI:</span>
          <p className="text-info font-medium">{speakingSession?.ai_character}</p>
        </div>
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">Độ khó:</span>
          <p className="text-error font-medium">{speakingSession?.level}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 px-4 pt-2 pb-24">
          <BlockquoteCustom
            title="Tình huống"
            variants="info"
            content={
              <div className="text-base leading-relaxed">
                {speakingSession?.scenario || 'Chưa có tình huống.'}
              </div>
            }
          />

          <SkipSentenceButton id={speakingSession?.id} />
          <HintButton id={speakingSession?.id} />
        </div>
      </div>
      {/* Bottom actions */}
      <div className="dark:bg-background sticky bottom-0 z-40 w-full rounded-b-2xl border-t bg-gray-50 p-4">
        <EndSessionButton
          id={speakingSession?.id}
          lid={searchParams.get('lid') ? Number(searchParams.get('lid')) : undefined}
        />
      </div>
    </div>
  );
};

export default React.memo(DetailRightPanel);
