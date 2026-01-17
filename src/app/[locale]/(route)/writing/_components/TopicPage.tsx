'use client';

import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

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
  const t = useTranslations('writing');
  const [activeTab, setActiveTab] = useState<string>('recent');

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('page.title')}
        description={t('page.description')}
        icon="/sidebarIcon/pen.png"
        iconAlt="Pen icon"
        ringColor="ring-violet-600"
      />

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-fit sm:min-w-md">
          <TabsTrigger value="recent" className="gap-2">
            <History className="size-4" />
            <span>{t('tabs.recent')}</span>
          </TabsTrigger>
          <TabsTrigger value="explore" className="gap-2">
            <Sparkles className="size-4" />
            <span>{t('tabs.explore')}</span>
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
