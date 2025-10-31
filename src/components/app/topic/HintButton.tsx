'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import { Button } from '@/components/ui/button';
import { HintResponseSchema } from '@/lib/schema/writing-session.schema';
import { getTranslationHintApi, useGetTranslationHintQuery } from '@/services/writing-session';

import { Loader2 } from 'lucide-react';

interface HintButtonProps {
  id?: number;
}

const HintButton = ({ id }: HintButtonProps) => {
  const [data, setData] = useState<HintResponseSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await getTranslationHintApi(id ?? 0);
      console.log(result);
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Button variant={'secondary'} size={'lg'} type="button" onClick={() => handleClick()}>
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Gợi ý'}
      </Button>
      {data && (
        <BlockquoteCustom
          variants="primary"
          title={`Gợi ý dịch câu ${data.sentence_index + 1}`}
          content={
            <>
              <Markdown>{data.hint}</Markdown>
            </>
          }
        />
      )}
    </div>
  );
};

export default HintButton;
