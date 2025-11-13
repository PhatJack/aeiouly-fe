'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';
import { imagesForTopics, levels, topics } from '@/lib/topic';

import { Dices, Filter } from 'lucide-react';

import TopicCard from './TopicCard';

interface RandomTopicsProps {
  onTopicSelect: (topic: WritingSessionCreateSchema) => void;
}

const RandomTopics: React.FC<RandomTopicsProps> = ({ onTopicSelect }) => {
  const [randomTopics, setRandomTopics] = useState<any[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const generateRandomTopics = useCallback(() => {
    const data = Array.from({ length: 25 }, (_, i) => ({
      topic: topics[i],
      level: levels[
        Math.floor(Math.random() * levels.length)
      ] as WritingSessionCreateSchema['level'],
      total_sentences: Math.floor(Math.random() * 15) + 5,
      image: imagesForTopics[i],
    }));
    setRandomTopics(data);
  }, []);

  useEffect(() => {
    generateRandomTopics();
  }, [generateRandomTopics]);

  const handleTopicClick = useCallback(
    (topic: WritingSessionCreateSchema) => {
      onTopicSelect({
        topic: topic.topic,
        level: topic.level,
        total_sentences: topic.total_sentences,
      });
    },
    [onTopicSelect]
  );

  const filteredTopics =
    levelFilter === 'all' ? randomTopics : randomTopics.filter((t) => t.level === levelFilter);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">Gợi ý chủ đề</h2>
          <p className="text-muted-foreground text-sm">
            Khám phá {filteredTopics.length} chủ đề đa dạng được tạo ngẫu nhiên
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Shuffle Button */}
          <Button variant="secondary-outline" onClick={generateRandomTopics} className="gap-2">
            <Dices className="size-4" />
            <span className="hidden sm:inline">Tạo mới</span>
          </Button>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTopics.map((item, index) => (
            <TopicCard
              key={`${item.topic}-${index}`}
              topic={item.topic}
              level={item.level}
              total_sentences={item.total_sentences}
              image={item.image}
              onClick={() => {
                const { image, ...rest } = item;
                handleTopicClick(rest);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="border-muted-foreground/25 bg-muted/30 rounded-lg border-2 border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            Không có chủ đề nào phù hợp với bộ lọc của bạn
          </p>
        </div>
      )}
    </div>
  );
};

export default RandomTopics;
