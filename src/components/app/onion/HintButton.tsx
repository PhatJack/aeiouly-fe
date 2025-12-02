'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import Markdown from 'react-markdown';

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
  }, [refetch, data, currentSentenceIndex]);

  return (
    <div className="w-full space-y-2">
      <Button variant="secondary" size="lg" type="button" onClick={handleClick}>
        {isFetching ? <Loader2 size={20} className="animate-spin" /> : 'Gợi ý'}
      </Button>

      {data && (
        <div className="space-y-2">
          <BlockquoteCustom
            variants="primary"
            title={`Gợi ý tiếp tục cuộc hội thoại`}
            content={<Markdown>{data.hint}</Markdown>}
          />
          {data.last_ai_message && (
            <BlockquoteCustom
              variants="info"
              title="Tin nhắn AI gần nhất"
              content={<Markdown>{data.last_ai_message}</Markdown>}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(HintButton);
