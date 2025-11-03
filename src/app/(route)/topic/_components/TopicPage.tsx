'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import TopicInsertForm from '@/components/app/topic/TopicInsertForm';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';
import { imagesForTopics, levels, topics } from '@/lib/topic';
import { cn } from '@/lib/utils';

const TopicPage = () => {
  const [randomTopics, setRandomTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<WritingSessionCreateSchema | undefined>(
    undefined
  );

  const handleTopicClick = useCallback((topic: WritingSessionCreateSchema) => {
    setSelectedTopic({
      topic: topic.topic,
      level: topic.level as WritingSessionCreateSchema['level'],
      total_sentences: topic.total_sentences,
    });
  }, []);

  useEffect(() => {
    const data = Array.from({ length: 25 }, (_, i) => ({
      topic: topics[i],
      level: levels[
        Math.floor(Math.random() * levels.length)
      ] as WritingSessionCreateSchema['level'],
      total_sentences: Math.floor(Math.random() * 25) + 1,
      image: imagesForTopics[i],
    }));

    setRandomTopics(data);
  }, []);

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="from-primary to-secondary mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
          Tự do tạo chủ đề theo sở thích của bạn
        </h1>
        <p className="text-muted-foreground text-lg">
          Khám phá các chủ đề hấp dẫn và bắt đầu cuộc trò chuyện ngay hôm nay!
        </p>
      </div>
      <div className="mx-auto w-full">
        <TopicInsertForm values={selectedTopic} />
      </div>
      <div className="mt-8">
        <div className="mb-4 flex items-center">
          <div className="bg-border h-px flex-1"></div>
          <span className="text-muted-foreground px-4 text-sm">
            Hoặc chọn một trong các chủ đề ngẫu nhiên dưới đây
          </span>
          <div className="bg-border h-px flex-1"></div>
        </div>
      </div>
      <div className="mt-4 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {randomTopics.map((item, index) => (
          <div
            onClick={() => {
              const { image, ...rest } = item;
              handleTopicClick(rest);
            }}
            key={`${item.topic}-${index}`}
            className="cursor-pointer"
          >
            <div
              className={cn(
                'border-border flex items-center justify-between rounded-lg border p-4 transition-all hover:scale-[1.02]',
                'dark:from-primary dark:via-secondary dark:to-accent from-primary/10 to-secondary/10 bg-gradient-to-br via-white'
              )}
            >
              <div className="flex flex-col">
                <h3 className="mb-2 text-lg font-semibold">{item.topic}</h3>
                <p className="text-muted-foreground text-sm">
                  Độ khó: <span className="text-primary font-medium">{item.level}</span> <br />
                  Tổng số câu: <span className="font-medium">{item.total_sentences}</span>
                </p>
              </div>
              <div className="relative size-20">
                <Image fill alt={item.topic} src={item.image} className="object-contain" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicPage;
