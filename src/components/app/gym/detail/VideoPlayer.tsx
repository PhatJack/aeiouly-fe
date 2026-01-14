'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { UrlToEmbeded } from '@/lib/utils';
import { useGymDetailStore } from '@/stores/gym-detail.store';

import { ArrowLeft, Play } from 'lucide-react';

const VideoPlayer = memo(() => {
  const session = useGymDetailStore((state) => state.session);
  const showVideo = useGymDetailStore((state) => state.showVideo);
  const playTrigger = useGymDetailStore((state) => state.playTrigger);
  const isAddYtbScript = useGymDetailStore((state) => state.isAddYtbScript);
  const isStarted = useGymDetailStore((state) => state.isStarted);
  const setIsPlaying = useGymDetailStore((state) => state.setIsPlaying);

  const { toggleVideo, setAddYtbScript } = useGymDetailStore();
  const router = useRouter();
  const t = useTranslations('listening');
  const videoRef = useRef<YT.PlayerEvent['target']>(null);
  const youtubeRef = useRef<any>(null);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoId =
    session?.lesson.youtube_url.split('v=')[1]?.split('&')[0] ||
    session?.lesson.youtube_url.split('/').pop();

  const currentSentence = session?.current_sentence;

  useEffect(() => {
    const initializeyoutube = () => {
      if (!session?.lesson.youtube_url) {
        console.log('Không có URL video YouTube');
        return;
      }

      const video = UrlToEmbeded(session?.lesson.youtube_url);
      if (!video?.videoId) {
        console.log('URL video không hợp lệ hoặc không thể trích xuất ID video');
        setVideoError(true);
        return;
      }

      try {
        youtubeRef.current = new window.YT.Player('yt-player', {
          height: '390',
          width: '640',
          videoId: `${video?.videoId}`,
          playerVars: {
            playsinline: 1,
            enablejsapi: 1,
            autoplay: 0,
            controls: 1,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            autohide: 1,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              videoRef.current = event.target;
              setVideoError(false);
            },
            onError: (event: YT.OnErrorEvent) => {
              setVideoError(true);
            },
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setVideoError(true);
      }
    };

    if (!isAddYtbScript) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      setAddYtbScript(true);

      (window as any).onYouTubeIframeAPIReady = () => {
        if (session?.lesson.youtube_url) {
          initializeyoutube();
        }
      };
    } else if (window.YT && window.YT.Player && session?.lesson.youtube_url) {
      initializeyoutube();
    }
  }, [videoId, session?.lesson.youtube_url, isAddYtbScript, setAddYtbScript]);

  useEffect(() => {
    if (videoRef.current && session) {
      try {
        videoRef.current.playVideo();
        videoRef.current.seekTo(currentSentence ? currentSentence.start_time : 0, true);
        setVideoError(false);
      } catch (error) {
        console.error('Error loading video:', error);
        setVideoError(true);
      }
    }
  }, [session, isStarted]);

  // Handle play button click
  useEffect(() => {
    if (!videoRef.current || !currentSentence || playTrigger === 0) return;

    try {
      videoRef.current.seekTo(currentSentence.start_time, true);
      videoRef.current.playVideo();
      setIsPlaying(true);
      setVideoError(false);
    } catch (error) {
      console.error('Error playing video:', error);
      setVideoError(true);
    }
  }, [playTrigger]);

  // Monitor video progress and pause at end time
  useEffect(() => {
    if (!videoRef.current || !currentSentence?.end_time || playTrigger === 0) return;
    const interval = setInterval(() => {
      const currentTime = videoRef.current?.getCurrentTime();
      const playerState = videoRef.current?.getPlayerState();

      // YT.PlayerState.PLAYING === 1
      if (playerState === 1 && currentTime && currentTime >= Math.round(currentSentence.end_time)) {
        videoRef.current?.pauseVideo();
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentSentence?.end_time, playTrigger]);

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
          <h1 className="text-lg font-semibold">{session?.lesson.title}</h1>
        </div>
      </CardHeader>
      {videoError && <div className="text-red-500">{t('video.unavailable')}</div>}
      <div className="relative aspect-video">
        <div id="yt-player" className="h-full w-full" />
        {!showVideo && (
          <div className="bg-muted absolute inset-0 flex aspect-video items-center justify-center">
            <Button variant="outline" size="lg" onClick={toggleVideo} className="gap-2">
              <Play className="h-5 w-5" />
              {t('video.show')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
