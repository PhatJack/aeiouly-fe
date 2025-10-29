import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

import Image from 'next/image';
import Link from 'next/link';

import LoadingSpinner from '@/components/loading/loading-spinner';
import AddFavoriteVideoModal from '@/components/solo/add-favorite-video';
import DeleteFavoriteVideo from '@/components/solo/delete-favorite-video';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useSoloContext } from '@/hooks/useSoloContext';
import { useDeleteUserFavoriteVideoApi } from '@/service/(user-favorite-video)/delete-user-favorite-video.api';
import { useInfiniteListUserFavoriteVideo } from '@/service/(user-favorite-video)/list-user-favorite-video.api';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Check, Loader2, Plus, Trash2 } from 'lucide-react';

const UserFavoriteVideos = () => {
  const { ref, inView } = useInView();
  const [stateAuth] = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, dispatch] = useSoloContext();
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...useInfiniteListUserFavoriteVideo({
      user: stateAuth.user?.id,
      ordering: 'created_at',
      page_size: 12,
    }),
    placeholderData: (previousData) => previousData,
  });

  const deleteVideoMutation = useDeleteUserFavoriteVideoApi();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleClick = (youtubeCode: string) => {
    if (youtubeCode === state.backgroundURL) return; // Skip if already selected

    setIsLoading(true);
    dispatch({ type: 'SET_BACKGROUND', payload: youtubeCode });

    // Reset loading state after a delay to allow video to load
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = (videoId: number) => {
    deleteVideoMutation.mutate(videoId, {
      onSuccess: () => {
        toast.success('Video removed from favorites.');
      },
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid max-h-60 w-full grid-cols-4 gap-1 overflow-y-auto pe-2">
        <AddFavoriteVideoModal>
          <Button
            type="button"
            className="text-primary aspect-square h-full w-full bg-gray-200 hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 [&_svg]:size-6"
          >
            <Plus />
          </Button>
        </AddFavoriteVideoModal>
        {data &&
          data?.results.map((backgroundVideo) => (
            <HoverCard key={backgroundVideo.id}>
              <HoverCardTrigger asChild>
                <div
                  onClick={() => handleClick(backgroundVideo.youtube_url)}
                  className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
                >
                  <span>{backgroundVideo.youtube_url}</span>
                  <Image
                    fill
                    src={
                      backgroundVideo.image ??
                      `https://img.youtube.com/vi/${
                        backgroundVideo.youtube_url.split('v=')[1]
                      }/1.jpg`
                    }
                    alt={backgroundVideo.name}
                    sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
                  />
                  {state.backgroundURL === backgroundVideo.youtube_url ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin text-white" />
                      ) : (
                        <Check size={26} className="text-white" />
                      )}
                    </div>
                  ) : null}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="bg-background max-w-md rounded-xl border p-4 shadow-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    Youtube:{' '}
                    <Link
                      href={backgroundVideo.author_url}
                      target="_blank"
                      prefetch={false}
                      className="hover:text-primary font-bold underline transition-all"
                    >
                      {backgroundVideo.author_name}
                    </Link>
                  </p>
                  <div className="relative h-32 max-h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={
                        backgroundVideo.image ??
                        `https://img.youtube.com/vi/${
                          backgroundVideo.youtube_url.split('v=')[1]
                        }/1.jpg`
                      }
                      fill
                      alt={backgroundVideo.name}
                      sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
                    />
                  </div>
                  <h3 className="text-sm font-semibold">{backgroundVideo.name}</h3>
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span>
                      Date added:{' '}
                      <span className="text-primary font-semibold">
                        {new Date(backgroundVideo.created_at).toLocaleDateString()}
                      </span>
                    </span>
                    <DeleteFavoriteVideo
                      videoId={backgroundVideo.id}
                      videoTitle={backgroundVideo.name}
                      onDelete={handleDelete}
                    >
                      <Button size={'icon'} className="h-8 w-8 hover:bg-rose-600" variant={'ghost'}>
                        <Trash2 />
                      </Button>
                    </DeleteFavoriteVideo>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        {
          <div ref={ref} className="col-span-4 w-full text-center text-xs">
            {isFetchingNextPage ? <LoadingSpinner /> : ''}
          </div>
        }
      </div>
    </div>
  );
};

export default UserFavoriteVideos;
