'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { Button } from '@/components/ui/button';
import { HintResponseSchema } from '@/lib/schema/writing-session.schema';
import { useGetTranslationHintQuery } from '@/services/writing-session';

import { Loader2 } from 'lucide-react';

interface HintButtonProps {
  id?: number;
  currentSentenceIndex?: number;
}

const HintButton = ({ id, currentSentenceIndex }: HintButtonProps) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(currentSentenceIndex ?? null);
  const [data, setData] = useState<HintResponseSchema | null>(null);

  const historyResult = useRef<HintResponseSchema | null>(null);

  const { refetch, isFetching } = useGetTranslationHintQuery(id ?? 0, {
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleClick = useCallback(async () => {
    if (historyResult.current && historyResult.current.sentence_index === currentIndex) {
      setData(historyResult.current);
      return;
    }

    const result = await refetch();
    if (result.data) {
      setData(result.data);
      historyResult.current = result.data;
    }
  }, [currentIndex, refetch]);

  useEffect(() => {
    if (currentSentenceIndex !== undefined && currentSentenceIndex !== currentIndex) {
      setCurrentIndex(currentSentenceIndex);
      setData(null);
      historyResult.current = null;
    }
  }, [currentSentenceIndex, currentIndex]);

  return (
    <div className="w-full space-y-2">
      <Button variant="secondary" size="lg" type="button" onClick={handleClick}>
        {isFetching ? <Loader2 size={20} className="animate-spin" /> : 'Gợi ý'}
      </Button>

      {currentIndex !== null && data && (
        <BlockquoteCustom
          variants="primary"
          title={`Gợi ý dịch câu ${data.sentence_index + 1}`}
          content={<Markdown>{data.hint}</Markdown>}
        />
      )}
    </div>
  );
};

export default memo(HintButton);
