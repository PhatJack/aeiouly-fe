'use client';

import React, { useState } from 'react';

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';

import BackgroundVideoTypesTable from './BackgroundVideoTypesTable';
import BackgroundVideosTable from './BackgroundVideosTable';
import SoundsTable from './SoundsTable';

const SpacePage = () => {
  const [activeTab, setActiveTab] = useState('sounds');

  const tabs = [
    {
      value: 'sounds',
      label: 'Âm thanh',
      content: <SoundsTable />,
    },
    {
      value: 'background-videos',
      label: 'Video nền',
      content: <BackgroundVideosTable />,
    },
    {
      value: 'background-video-types',
      label: 'Loại video',
      content: <BackgroundVideoTypesTable />,
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý Không gian tự học</h1>
        <p className="text-muted-foreground text-sm">
          Quản lý âm thanh, video nền và loại video cho không gian tự học
        </p>
      </div>
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContents>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
};

export default SpacePage;
