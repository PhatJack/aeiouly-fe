'use client';

import React, { useEffect } from 'react';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { SpeakingSessionResponseSchema } from '@/lib/schema/speaking-session.schema';

import EndSessionButton from './EndSessionButton';
import HintButton from './HintButton';
import SkipSentenceButton from './SkipSentenceButton';

interface DetailRightPanelProps {
  speakingSession?: SpeakingSessionResponseSchema;
}

const DetailRightPanel = ({ speakingSession }: DetailRightPanelProps) => {
  const t = useTranslations('speaking');
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
    <div className="border-border/50 dark:bg-background flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-gray-50">
      <div className="dark:bg-muted grid grid-cols-2 divide-x divide-y rounded-t-2xl border-b sm:grid-cols-3 sm:gap-2 sm:divide-y-0">
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">{t('panel.myCharacter')}:</span>
          <p className="text-success font-medium">{speakingSession?.my_character}</p>
        </div>
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">{t('panel.aiCharacter')}:</span>
          <p className="text-info font-medium">{speakingSession?.ai_character}</p>
        </div>
        <div className="flex flex-col space-y-1 px-4 py-2">
          <span className="text-muted-foreground">{t('panel.difficulty')}:</span>
          <p className="text-error font-medium">{speakingSession?.level}</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 px-4 pt-2 pb-24">
          <BlockquoteCustom
            title={t('panel.scenario')}
            variants="info"
            content={
              <div className="text-base leading-relaxed">
                {speakingSession?.scenario || t('panel.noScenario')}
              </div>
            }
          />

          <SkipSentenceButton id={speakingSession?.id} />
          <HintButton id={speakingSession?.id} />
        </div>
      </ScrollArea>
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
