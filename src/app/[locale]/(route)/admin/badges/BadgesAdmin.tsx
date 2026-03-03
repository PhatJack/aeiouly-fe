'use client';

import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import BadgeCategoriesTable from './BadgeCategoriesTable';
import BadgesTable from './BadgesTable';

const BadgesAdmin = () => {
  const [activeTab, setActiveTab] = useState('badges');

  const tabs = [
    {
      value: 'badges',
      label: 'Danh hiệu',
      content: <BadgesTable />,
    },
    {
      value: 'categories',
      label: 'Nhóm danh hiệu',
      content: <BadgeCategoriesTable />,
    },
  ];

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Quản lý danh hiệu</h1>
        <p className="text-muted-foreground text-sm">
          Quản lý danh hiệu và gom nhóm danh hiệu để hiển thị/seed dễ hơn
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

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default BadgesAdmin;
