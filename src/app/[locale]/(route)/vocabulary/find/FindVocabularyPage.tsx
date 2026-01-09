'use client';

import React, { Suspense, use, useEffect, useState } from 'react';

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
            placeholder="Nhập từ vựng cần tra cứu..."
          />

          <AlertCustom
            icon={<Info className="text-primary" />}
            title="Chọn từ để xem chi tiết"
            variant={'info'}
          />

          {/* Results */}
          {!params.q && (
            <EmptyCustom
              icon={<Search className="text-primary" />}
              title="Bắt đầu tìm kiếm"
              description="Nhập từ vựng tiếng Anh vào ô tìm kiếm để tra cứu định nghĩa"
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
              title="Không thể tải dữ liệu"
              description="Đã xảy ra lỗi khi tìm kiếm từ vựng"
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
                  title="Không tìm thấy kết quả"
                  description={`Không tìm thấy từ vựng "${params.q}" trong từ điển. Thử tìm kiếm với từ khóa khác.`}
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
              title="Chưa chọn từ vựng"
              description="Chọn một từ vựng từ danh sách tìm kiếm để xem chi tiết định nghĩa"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FindVocabularyPage;
