'use client';

import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import BackgroundVideoTypesTable from './BackgroundVideoTypesTable';
import BackgroundVideosTable from './BackgroundVideosTable';
import SoundsTable from './SoundsTable';

const SpacePage = () => {
  const [activeTab, setActiveTab] = useState('sounds');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý Không gian Solo</h1>
        <p className="text-muted-foreground">
          Quản lý âm thanh, video nền và loại video cho các phiên học solo
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="sounds">Âm thanh</TabsTrigger>
          <TabsTrigger value="background-videos">Video nền</TabsTrigger>
          <TabsTrigger value="background-video-types">Loại video</TabsTrigger>
        </TabsList>

        <TabsContent value="sounds" className="mt-6">
          <SoundsTable />
        </TabsContent>

        <TabsContent value="background-videos" className="mt-6">
          <BackgroundVideosTable />
        </TabsContent>

        <TabsContent value="background-video-types" className="mt-6">
          <BackgroundVideoTypesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpacePage;
