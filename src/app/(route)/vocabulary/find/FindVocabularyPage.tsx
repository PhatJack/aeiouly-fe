'use client';

import React, { useEffect, useState } from 'react';

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

const FindVocabularyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedWord, setSelectedWord] = useState<DictionaryResponseSchema | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  const { data, isLoading, isError } = useSearchWordsQuery(
    {
      query: searchQuery,
      limit: 20,
    },
    !!searchQuery
  );

  const handleWordSelect = (word: DictionaryResponseSchema) => {
    setSelectedWord(word);
  };

  return (
    <div className="h-full">
      <div className="grid gap-4 lg:grid-cols-[1fr_500px]">
        <div className="space-y-4">
          <DictionarySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Nhập từ vựng cần tra cứu..."
          />

          <AlertCustom
            icon={<Info className="text-primary" />}
            title="Chọn từ để xem chi tiết"
            variant={'info'}
          />

          {/* Results */}
          {!searchQuery && (
            <EmptyCustom
              icon={<Search className="text-primary" />}
              title="Bắt đầu tìm kiếm"
              description="Nhập từ vựng tiếng Anh vào ô tìm kiếm để tra cứu định nghĩa"
            />
          )}

          {searchQuery && isLoading && (
            <div className="grid gap-4 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          )}

          {searchQuery && isError && (
            <EmptyCustom
              icon={<BookOpen className="text-muted-foreground" />}
              title="Không thể tải dữ liệu"
              description="Đã xảy ra lỗi khi tìm kiếm từ vựng"
            />
          )}
          {searchQuery && !isLoading && !isError && data && (
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
                  description={`Không tìm thấy từ vựng "${searchQuery}" trong từ điển. Thử tìm kiếm với từ khóa khác.`}
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
