'use client';

import React from 'react';
import Markdown from 'react-markdown';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import MarkdownRender from '@/components/shared/MarkdownRender';
import { Button } from '@/components/ui/button';
import { useGetTranslationHintQuery } from '@/services/writing-session';

interface HintButtonProps {
  id?: number;
}

const HintButton = ({ id }: HintButtonProps) => {
  const { data, refetch } = useGetTranslationHintQuery(id ?? 0, {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full space-y-2">
      <Button variant={'secondary'} size={'lg'} type="button" onClick={() => refetch()}>
        Gợi ý
      </Button>
      {data && (
        <BlockquoteCustom
          variants="primary"
          content={
            <>
              <span>Gợi ý cho câu số {data.sentence_index + 1}:</span>
              <Markdown>{data.hint}</Markdown>
            </>
          }
        />
      )}
    </div>
  );
};

export default HintButton;
