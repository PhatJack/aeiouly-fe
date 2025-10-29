'use client';

// import YoutubeLinkInput from "@/components/solo/background-list/youtube-link-input";
import React, { useState } from 'react';

import YoutubeLinkInput from '@/components/app/solo/YoutubeLinkInput';
import BackgroundContainer from '@/components/app/solo/background-list/background-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FolderOpenDot, Heart } from 'lucide-react';

import UserFavoriteVideos from './user-favorite-videos';

const BackgroundList = () => {
  const [activeTab, setActiveTab] = useState<'default' | 'favorite'>('default');
  const onTabChange = (value: string) => {
    setActiveTab(value as 'default' | 'favorite');
  };
  return (
    <div className="bg-background flex w-full flex-col space-y-4 rounded-md p-5 shadow-lg">
      <Tabs value={activeTab} onValueChange={onTabChange} defaultValue="default" className="w-full">
        <TabsList className="bg-background mb-3 h-auto w-full -space-x-px p-0 shadow-xs rtl:space-x-reverse">
          <TabsTrigger
            value="default"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full gap-2 overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <FolderOpenDot
              size={20}
              className="dark:stroke-background fill-amber-400 stroke-gray-200"
            />
            {/* Default */}
          </TabsTrigger>
          <TabsTrigger
            value="favorite"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-full gap-2 overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <Heart className="dark:stroke-background fill-rose-600 stroke-gray-200" size={20} />
            {/* Favorite */}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="default" className="mt-0 flex flex-col gap-3">
          <BackgroundContainer />
        </TabsContent>
        <TabsContent value="favorite" className="mt-0">
          <p className="text-muted-foreground mb-3 text-xs italic">
            You can add your favorite video here.
          </p>
          {/* <UserFavoriteVideos /> */}
        </TabsContent>
      </Tabs>
      <YoutubeLinkInput />
    </div>
  );
};

export default React.memo(BackgroundList);
