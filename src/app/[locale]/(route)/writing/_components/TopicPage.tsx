'use client';

import React, { useState } from 'react';

import PageHeader from '@/components/PageHeader';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';

import { History, Sparkles } from 'lucide-react';

import RandomTopics from './RandomTopics';
import RecentSessions from './RecentSessions';

const TopicPage = () => {
  const [activeTab, setActiveTab] = useState<string>('recent');

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
        <TabsList className="w-full sm:w-fit sm:min-w-md">
          <TabsTrigger value="recent" className="gap-2">
            <History className="size-4" />
            <span>Gần đây</span>
          </TabsTrigger>
          <TabsTrigger value="explore" className="gap-2">
            <Sparkles className="size-4" />
            <span>Khám phá</span>
          </TabsTrigger>
        </TabsList>
        <TabsContents className="mt-4">
          <TabsContent value="recent">
            <RecentSessions />
          </TabsContent>

          <TabsContent value="explore">
            <RandomTopics />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
};

export default TopicPage;
