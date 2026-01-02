'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useSoloStore } from '@/hooks/use-solo-store';
import { cn } from '@/lib/utils';

import { Music, Pause, Play, Volume2 } from 'lucide-react';

declare global {
  interface Window {
    SC: any;
  }
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const SoundcloudPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);

  const url = useSoloStore((state) => state.soundcloudUrl);
  const setSoundcloudUrl = useSoloStore((state) => state.setSoundcloudUrl);
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

  const loadTrack = () => {
    if (!iframeRef.current || !url.includes('soundcloud.com')) return;

    iframeRef.current.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      url
    )}&auto_play=true`;

    setTimeout(() => {
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
    }, 500);
  };

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSoundcloudUrl(e.target.value);
    },
    [setSoundcloudUrl]
  );

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

  useEffect(() => {
    if (url) loadTrack();
  }, [url]);

  return (
    <Card className="mx-auto max-w-xl min-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            SoundCloud Player
            <Badge className="ml-2">NEW</Badge>
          </div>
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
          <Button size="icon" variant="outline" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Input placeholder="Paste SoundCloud URL" value={url} onChange={handleUrlChange} />
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="outline">
                <Volume2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="h-52 w-12 p-2" side="top" align="center">
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
            </PopoverContent>
          </Popover>
        </div>

        {/* Progress */}
        <div className="my-4 space-y-2">
          <Slider
            value={[duration ? (position / duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={seek}
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
