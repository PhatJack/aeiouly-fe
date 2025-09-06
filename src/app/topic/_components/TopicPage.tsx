'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Hash, Search } from 'lucide-react';

// Các chủ đề gợi ý
const SUGGESTED_TOPICS = [
  'Trí tuệ nhân tạo',
  'Lập trình Web',
  'Khoa học dữ liệu',
  'Học máy',
  'Blockchain',
  'Điện toán đám mây',
  'An ninh mạng',
  'Internet vạn vật',
  'Thiết kế giao diện',
  'Lập trình di động',
  'Công nghệ thông tin',
  'Kinh doanh trực tuyến',
  'Tiếng Anh chuyên ngành',
  'Du lịch Việt Nam',
  'Ẩm thực Việt',
];

const TopicPage = () => {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter suggestions based on input
  useEffect(() => {
    if (topic.trim() === '') {
      setSuggestions(SUGGESTED_TOPICS);
    } else {
      const filtered = SUGGESTED_TOPICS.filter((t) =>
        t.toLowerCase().includes(topic.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [topic]);

  const handleSearch = () => {
    const searchTerm = topic.trim();
    if (searchTerm) {
      setIsSearching(true);
      // Navigate to the topic detail page
      router.push(`/topic/${encodeURIComponent(searchTerm.toLowerCase())}`);
    }
  };

  const handleSuggestionClick = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
    // Auto-search when clicking a suggestion
    setTopic(suggestedTopic);
    // Small delay to allow state update
    setTimeout(() => {
      handleSearch();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center p-6">
      <div className="mb-10 text-center">
        <h1 className="from-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          Khám phá chủ đề thú vị
        </h1>
        <p className="text-muted-foreground text-lg">
          Tìm kiếm kiến thức, thông tin và thảo luận về bất kỳ chủ đề nào bạn quan tâm
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm chủ đề (ví dụ: Trí tuệ nhân tạo)"
            className="border-input w-full border-2 py-6 pr-6 pl-12 text-lg"
          />
          <Button
            onClick={handleSearch}
            variant={'default'}
            disabled={isSearching || !topic.trim()}
            className="absolute top-1/2 right-2 -translate-y-1/2 transform"
            size="lg"
          >
            {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
          </Button>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center">
            <div className="bg-border h-px flex-1"></div>
            <span className="text-muted-foreground px-4 text-sm">
              Hoặc chọn một trong các chủ đề
            </span>
            <div className="bg-border h-px flex-1"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
              >
                <Hash className="text-primary h-4 w-4" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
