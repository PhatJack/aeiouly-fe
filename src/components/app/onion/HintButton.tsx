'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

import { useTranslations } from 'next-intl';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { Button } from '@/components/ui/button';
import { SpeakingSessionContext } from '@/contexts/SpeakingSessionContext';
import { HintResponseSchema } from '@/lib/schema/speaking-session.schema';
import { useGetConversationHintQuery } from '@/services/speaking-session';

import { Loader2 } from 'lucide-react';
import { useContextSelector } from 'use-context-selector';

interface HintButtonProps {
  id?: number;
}

const HintButton = ({ id }: HintButtonProps) => {
  const t = useTranslations('speaking');
  const currentSentenceIndex = useContextSelector(
    SpeakingSessionContext,
    (ctx) => ctx?.currentSentenceIndex ?? 0
  );
  const [data, setData] = useState<HintResponseSchema | null>(null);
  const historyLoaded = useRef<boolean>(false);

  const { refetch, isFetching } = useGetConversationHintQuery(id ?? 0, {
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleClick = useCallback(async () => {
    if (historyLoaded.current && data) return;
    const result = await refetch();
    if (result.data) {
      setData(result.data);
      historyLoaded.current = true;
    }
  }, [refetch, data]);

  useEffect(() => {
    setData(null);
    historyLoaded.current = false;
  }, [currentSentenceIndex]);

  return (
    <div className="w-full space-y-2">
      <Button variant="secondary" size="lg" type="button" onClick={handleClick}>
        {isFetching ? <Loader2 size={20} className="animate-spin" /> : t('hint.button')}
      </Button>

      {data && (
        <div className="space-y-2">
          <BlockquoteCustom
            variants="primary"
            title={t('hint.conversationHint')}
            content={<Markdown>{data.hint}</Markdown>}
          />
          {data.last_ai_message && (
            <BlockquoteCustom
              variants="info"
              title={t('hint.lastAiMessage')}
              content={<Markdown>{data.last_ai_message}</Markdown>}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(HintButton);
