'use client';

import React, { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CambridgeDictionaryResponse } from '@/lib/schema/dictionary.schema';
import { VocabularyItemResponseSchema } from '@/lib/schema/vocabulary.schema';

import { Trash, Volume2 } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

import PronunciationPlayer from '../gym/detail/PronunciationPlayer';

interface VocabularyItemCardProps {
  item: VocabularyItemResponseSchema;
  onRemove: (itemId: number) => void;
}

const VocabularyItemCard = ({ item, onRemove }: VocabularyItemCardProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CambridgeDictionaryResponse | { error: string } | null>(
    null
  );
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!item.word) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dictionary?entry=${encodeURIComponent(item.word)}&language=en`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const data: CambridgeDictionaryResponse = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Error fetching pronunciation data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [item.word]);

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">{item.word}</h3>
              {result && 'pronunciation' in result && result?.pronunciation && (
                <PronunciationPlayer pronunciations={result ? result.pronunciation : []} />
              )}
              {loading && (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
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

export default memo(VocabularyItemCard);
