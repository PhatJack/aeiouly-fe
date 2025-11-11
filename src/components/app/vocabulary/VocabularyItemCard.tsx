'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VocabularyItemResponseSchema } from '@/lib/schema/vocabulary.schema';
import { parseDefinitions } from '@/lib/utils';

import { Trash, Volume2 } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

interface VocabularyItemCardProps {
  item: VocabularyItemResponseSchema;
  onRemove: (itemId: number) => void;
  onPlayAudio?: (word: string) => void;
}

const VocabularyItemCard = ({ item, onRemove, onPlayAudio }: VocabularyItemCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">{item.word}</h3>
              {onPlayAudio && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPlayAudio(item.word || '')}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {item.definitions && (
              <div className="prose prose-sm mt-3 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {item.definitions.replace(/\\n/g, '\n')}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularyItemCard;
