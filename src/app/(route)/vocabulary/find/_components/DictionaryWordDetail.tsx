'use client';

import React, { memo, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import PronunciationPlayer from '@/components/app/gym/detail/PronunciationPlayer';
import VocabularyDialog from '@/components/shared/VocabularyDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CambridgeDictionaryResponse,
  DictionaryResponseSchema,
} from '@/lib/schema/dictionary.schema';

import { BookMarked, Hash, Languages } from 'lucide-react';
import remarkBreaks from 'remark-breaks';

interface DictionaryWordDetailProps {
  word: DictionaryResponseSchema;
}

const DictionaryWordDetail: React.FC<DictionaryWordDetailProps> = ({ word }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CambridgeDictionaryResponse | { error: string } | null>(
    null
  );
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!word.expression) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dictionary?entry=${encodeURIComponent(word.expression)}&language=en`,
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
      } else {
        setResult({ error: 'Failed to fetch data' });
      }
    } catch (error) {
      console.error('Error fetching pronunciation data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [word.expression]);

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <BookMarked className="text-primary h-8 w-8" />
                {word.expression}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4" />
                Word ID: {word.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ) : (
                result &&
                !(result as any).error &&
                'pronunciation' in result &&
                !(result as any).error &&
                result?.pronunciation && (
                  <PronunciationPlayer pronunciations={result ? result.pronunciation : []} />
                )
              )}
              <div className="">
                <Button onClick={() => setOpen(true)}>Thêm vào bộ từ vựng</Button>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Languages className="text-primary h-5 w-5" />
                <h3 className="text-lg font-semibold">Định nghĩa</h3>
              </div>
              <div className="bg-muted/50 dark:bg-background prose prose-sm text-accent-foreground max-w-none space-y-3 rounded-lg p-4 *:mb-0">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {word.definitions.replace(/\\n/g, '\n')}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <VocabularyDialog textSelection={word.expression} open={open} onOpenChange={setOpen} />
    </>
  );
};

export default memo(DictionaryWordDetail);
