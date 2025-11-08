'use client';

import React, { useCallback, useState } from 'react';

import PageHeader from '@/components/PageHeader';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';

import { History, Sparkles } from 'lucide-react';

import RandomTopics from './RandomTopics';
import RecentSessions from './RecentSessions';

const TopicPage = () => {
  const [selectedTopic, setSelectedTopic] = useState<WritingSessionCreateSchema | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState<string>('recent');

  const handleTopicSelect = useCallback((topic: WritingSessionCreateSchema) => {
    setSelectedTopic({
      topic: topic.topic,
      level: topic.level,
      total_sentences: topic.total_sentences,
    });
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Luyện Viết"
        description="Giúp người học luyện viết tiếng Anh tự nhiên, mở rộng vốn từ, và học cách diễn đạt như người bản ngữ thông qua việc viết cùng AI (AI viết tiếp hoặc gợi ý nâng cấp câu)."
        icon="/sidebarIcon/pen.png"
        iconAlt="Pen icon"
        ringColor="ring-violet-600"
      />

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="min-w-md">
          <TabsTrigger value="recent" className="gap-2">
            <History className="size-4" />
            <span className="hidden sm:inline">Gần đây</span>
          </TabsTrigger>
          <TabsTrigger value="explore" className="gap-2">
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">Khám phá</span>
          </TabsTrigger>
        </TabsList>
        <TabsContents className="mt-4">
          <TabsContent value="recent">
            <RecentSessions selectedTopic={selectedTopic} />
          </TabsContent>

          <TabsContent value="explore">
            <RandomTopics onTopicSelect={handleTopicSelect} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
};

export default TopicPage;
