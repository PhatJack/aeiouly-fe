'use client';

import React, { memo } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';

import { ArrowLeft, Play } from 'lucide-react';

interface VideoPlayerProps {
  session: SessionDetailResponseSchema;
  showVideo: boolean;
  onToggleVideo: () => void;
}

const VideoPlayer = memo(({ session, showVideo, onToggleVideo }: VideoPlayerProps) => {
  const router = useRouter();
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?start=6.76&end=8.94`;
  };

  return (
    <Card className="bg-muted/30 gap-0 overflow-hidden py-0">
      <CardHeader className="py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="size-10 [&_svg:not([class*='size-'])]:size-6"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-lg font-semibold">{session.lesson.title}</h1>
        </div>
      </CardHeader>
      {showVideo ? (
        <div className="aspect-video">
          <iframe
            src={getYouTubeEmbedUrl(session.lesson.youtube_url)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="bg-muted flex aspect-video items-center justify-center">
          <Button variant="outline" size="lg" onClick={onToggleVideo} className="gap-2">
            <Play className="h-5 w-5" />
            Show video
          </Button>
        </div>
      )}
    </Card>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
