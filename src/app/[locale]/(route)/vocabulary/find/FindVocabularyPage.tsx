'use client';

import React, { use, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import AlertCustom from '@/components/custom/AlertCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { DictionaryResponseSchema } from '@/lib/schema/dictionary.schema';
import { useSearchWordsQuery } from '@/services/dictionary';

import { BookOpen, Info, Search } from 'lucide-react';

import DictionarySearchInput from './_components/DictionarySearchInput';
import DictionaryWordCard from './_components/DictionaryWordCard';
import DictionaryWordDetail from './_components/DictionaryWordDetail';

interface FindVocabularyPageProps {
  searchParams: Promise<{ q?: string }>;
}

const FindVocabularyPage = ({ searchParams }: FindVocabularyPageProps) => {
  const router = useRouter();
  const params = use(searchParams);
  const [selectedWord, setSelectedWord] = useState<DictionaryResponseSchema | null>(null);
  const t = useTranslations('vocabulary');

  const { data, isLoading, isError } = useSearchWordsQuery(
    {
      query: params.q || '',
      limit: 20,
    },
    {
      enabled: !!params.q,
    }
  );

  const handleWordSelect = (word: DictionaryResponseSchema) => {
    setSelectedWord(word);
  };

  return (
    <div className="h-full">
      <div className="grid gap-4 lg:grid-cols-[1fr_500px]">
        <div className="space-y-4">
          <DictionarySearchInput
            value={params.q || ''}
            onChange={(value) => {
              const paramsURL = new URLSearchParams();
              if (value) {
                paramsURL.set('q', value);
              }
              router.replace(`?${paramsURL.toString()}`, { scroll: false });
            }}
            placeholder={t('find.search.placeholder')}
          />

          <AlertCustom
            icon={<Info className="text-primary" />}
            title={t('find.alert.selectWord')}
            variant={'info'}
          />

          {/* Results */}
          {!params.q && (
            <EmptyCustom
              icon={<Search className="text-primary" />}
              title={t('find.empty.startSearch.title')}
              description={t('find.empty.startSearch.description')}
            />
          )}

          {params.q && isLoading && (
            <div className="grid gap-4 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          )}

          {params.q && isError && (
            <EmptyCustom
              icon={<BookOpen className="text-muted-foreground" />}
              title={t('find.empty.noData.title')}
              description={t('find.empty.noData.description')}
            />
          )}
          {params.q && !isLoading && !isError && data && (
            <>
              {data.items.length > 0 ? (
                <ScrollArea>
                  <div className="grid gap-4 pr-4 sm:grid-cols-2 xl:grid-cols-3">
                    {data.items.map((word) => (
                      <DictionaryWordCard
                        key={word.id}
                        word={word}
                        onSelect={handleWordSelect}
                        isSelected={selectedWord?.id === word.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <EmptyCustom
                  icon={<BookOpen className="text-primary" />}
                  title={t('find.empty.noResults.title')}
                  description={t('find.empty.noResults.description', { query: params.q })}
                />
              )}
            </>
          )}
        </div>

        <div className="lg:sticky lg:h-fit">
          {selectedWord ? (
            <DictionaryWordDetail word={selectedWord} />
          ) : (
            <EmptyCustom
              icon={<BookOpen className="text-muted-foreground" />}
              title={t('find.empty.noSelection.title')}
              description={t('find.empty.noSelection.description')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FindVocabularyPage;
