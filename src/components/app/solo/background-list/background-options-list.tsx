import React, { useState } from 'react';

import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';
import { useSoloStore } from '@/hooks/use-solo-store';
import { useGetAllBackgroundVideosQuery } from '@/services/background-videos';

import { Check, Loader2 } from 'lucide-react';

interface Props {
  activeTab: number;
}

const BackgroundOptionsList = ({ activeTab }: Props) => {
  const { backgroundURL, setBackground } = useSoloStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const backgroundVideosQuery = useGetAllBackgroundVideosQuery();

  // Filter videos by active tab/type
  const backgroundVideos = backgroundVideosQuery.data?.items.filter(
    (video) => video.type_id === activeTab
  );

  const handleClick = (youtubeUrl: string) => {
    if (youtubeUrl === backgroundURL) return; // Skip if already selected

    setIsLoading(true);
    setBackground(youtubeUrl);

    // Reset loading state after a delay to allow video to load
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="grid w-full grid-cols-4 gap-1">
      {backgroundVideosQuery.isLoading
        ? Array.from({ length: 9 }).map((_, i) => <Skeleton className="size-14" key={i} />)
        : null}
      {backgroundVideos?.length === 0 && (
        <div className="col-span-4 text-xs text-gray-800">
          Không có video nào trong danh mục này.
        </div>
      )}
      {backgroundVideosQuery.isSuccess &&
        backgroundVideos?.map((backgroundVideo) => (
          <div
            key={backgroundVideo.id}
            onClick={() => handleClick(backgroundVideo.youtube_url)}
            className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
          >
            <Image
              fill
              src={
                backgroundVideo.image_url ??
                `https://img.youtube.com/vi/${backgroundVideo.youtube_url.split('v=')[1]}/1.jpg`
              }
              quality={75}
              className="bg-muted"
              alt={'video youtube'}
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
            />
            {backgroundURL === backgroundVideo.youtube_url ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <Check size={26} className="text-white" />
                )}
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default BackgroundOptionsList;
