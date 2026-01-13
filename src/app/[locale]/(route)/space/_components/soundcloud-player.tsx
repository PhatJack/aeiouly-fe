'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useSoloStore } from '@/hooks/use-solo-store';
import { cn } from '@/lib/utils';

import { Info, Music, Pause, Play, Volume2, VolumeOff } from 'lucide-react';

declare global {
  interface Window {
    SC: any;
  }
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours > 0 ? hours + ':' : ''}${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const SoundcloudPlayer = () => {
  const t = useTranslations('space');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const url = useSoloStore((state) => state.soundcloudUrl);
  const setSoundcloudUrl = useSoloStore((state) => state.setSoundcloudUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(70);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [artwork, setArtwork] = useState<string | null>(null);

  // Load SoundCloud Widget API
  useEffect(() => {
    if (window.SC) return;

    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Load track when URL changes
  useEffect(() => {
    if (!url || !url.includes('soundcloud.com')) {
      if (url && !url.includes('soundcloud.com')) {
        setError(t('soundcloud.invalidUrl'));
      }
      return;
    }

    if (!iframeRef.current || !window.SC) return;

    // Reset state before loading new track
    setError(null);
    setIsPlaying(false);
    setDuration(0);
    setPosition(0);
    setTitle('');
    setArtist('');
    setArtwork(null);

    // Unbind all previous events if widget exists
    if (widgetRef.current) {
      widgetRef.current.unbind(window.SC.Widget.Events.READY);
      widgetRef.current.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
      widgetRef.current.unbind(window.SC.Widget.Events.PAUSE);
      widgetRef.current.unbind(window.SC.Widget.Events.PLAY);
      widgetRef.current.unbind(window.SC.Widget.Events.FINISH);
    }

    iframeRef.current.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      url
    )}&auto_play=true`;

    timerRef.current = setTimeout(() => {
      if (!iframeRef.current) return;

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.getDuration((d: number) => setDuration(d));
        widget.setVolume(volume);

        widget.getCurrentSound((sound: any) => {
          setTitle(sound.title);
          setArtist(sound.user.username);
          setArtwork(sound.artwork_url ? sound.artwork_url.replace('-large', '-t300x300') : null);
        });

        setIsPlaying(true);
      });

      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: any) => {
        setPosition(e.currentPosition);
      });

      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        widget.seekTo(0);
        widget.play();
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [url, volume]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundcloudUrl(e.target.value);
  };

  const togglePlay = () => {
    widgetRef.current?.toggle();
  };

  const changeVolume = (value: number[]) => {
    setVolume(value[0]);
    widgetRef.current?.setVolume(value[0]);
  };

  const seek = (value: number[]) => {
    const newPos = (value[0] / 100) * duration;
    widgetRef.current?.seekTo(newPos);
  };

  return (
    <Card className="mx-auto max-w-xl min-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {t('soundcloud.title')}
            <Badge className="ml-2">{t('soundcloud.new')}</Badge>
          </div>
          <TooltipCustom content={t('soundcloud.tooltip')}>
            <Button size="icon" variant="ghost">
              <Info />
            </Button>
          </TooltipCustom>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Track info */}
        {title && (
          <div className="flex items-center gap-4">
            {artwork && (
              <Image
                width={64}
                height={64}
                sizes="100vw"
                src={artwork}
                alt={title}
                className="size-16 rounded-md object-cover"
              />
            )}
            <div>
              <p className="leading-tight font-medium">{title}</p>
              <p className="text-muted-foreground text-sm">{artist}</p>
            </div>
          </div>
        )}

        {/* URL + Play + Volume */}
        <div className={cn('flex items-center gap-2', title && 'mt-4')}>
          <Button size="icon" variant="primary-outline" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Input
            placeholder={t('soundcloud.urlPlaceholder')}
            value={url}
            onChange={handleUrlChange}
          />
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  if (volume > 0) {
                    changeVolume([0]);
                  } else {
                    changeVolume([70]);
                  }
                }}
              >
                {volume === 0 ? <VolumeOff className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="h-52 w-12 p-2" side="top" align="center">
              <div className="flex h-full items-center justify-center">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={changeVolume}
                  orientation="vertical"
                  className="max-h-44"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        {/* Progress */}
        <div className="my-4 space-y-2">
          <Slider
            value={[duration ? (position / duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={seek}
            className='[&_span[data-slot="slider-thumb"]]:hidden [&_span[data-slot="slider-thumb"]]:transition-all hover:[&_span[data-slot="slider-thumb"]]:block'
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Hidden iframe */}
        <iframe ref={iframeRef} title="SoundCloud Player" className="hidden" allow="autoplay" />
      </CardContent>
    </Card>
  );
};

export default SoundcloudPlayer;
