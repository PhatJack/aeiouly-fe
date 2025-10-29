import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllBackgroundVideoTypesQuery } from '@/services/background-video-types';

interface Props {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const BackgroundTypesList = ({ activeTab, setActiveTab }: Props) => {
  const backgroundVideoTypesQuery = useGetAllBackgroundVideoTypesQuery();

  const backgroundVideoTypes = backgroundVideoTypesQuery.data?.items;

  useEffect(() => {
    if (
      backgroundVideoTypesQuery.isSuccess &&
      backgroundVideoTypes &&
      backgroundVideoTypes.length > 0
    ) {
      setActiveTab(backgroundVideoTypes[0].id);
    }
  }, [backgroundVideoTypesQuery.isSuccess, backgroundVideoTypes, setActiveTab]);

  return (
    <div className="flex flex-wrap gap-1">
      {backgroundVideoTypesQuery.isLoading && (
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-12 rounded-full" />
          ))}
        </div>
      )}
      {backgroundVideoTypesQuery.isSuccess &&
        backgroundVideoTypes?.map((backgroundType) => (
          <Button
            type="button"
            size={'sm'}
            variant={activeTab === backgroundType.id ? 'default' : 'outline'}
            className="h-6 rounded-full border px-1.5 shadow-md"
            key={backgroundType.id}
            onClick={() => setActiveTab(backgroundType.id)}
          >
            {backgroundType.name}
          </Button>
        ))}
    </div>
  );
};

export default React.memo(BackgroundTypesList);
