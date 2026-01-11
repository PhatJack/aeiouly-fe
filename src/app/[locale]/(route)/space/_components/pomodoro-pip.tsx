'use client';

import React, { useEffect, useRef, useState } from 'react';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { formatTime, usePomodoroStore } from '@/hooks/use-pomodoro-store';

import { PictureInPicture } from 'lucide-react';

const PomodoroPiP: React.FC = () => {
  const { remainingTime, isRunning, toggleTimer } = usePomodoroStore();

  const [isPipActive, setIsPipActive] = useState(false);

  // Refs for the hidden elements
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to draw the timer on the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear Background
    ctx.fillStyle = '#09090b'; // Zinc-950 (Dark theme background)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Optional: Draw a subtle gradient or accent
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Format Text
    const { hours, minutes, seconds } = formatTime(remainingTime);
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const statusStr = isRunning ? 'FOCUS' : 'PAUSED';

    // 4. Draw Timer Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif'; // Adjust size as needed
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Center X, Center Y
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillText(timeStr, centerX, centerY);

    // 5. Draw Status Text (Smaller below)
    ctx.fillStyle = isRunning ? '#4ade80' : '#facc15'; // Green if running, Yellow if paused
    ctx.font = '500 30px sans-serif';
    ctx.fillText(statusStr, centerX, centerY + 60);
  };

  // Update canvas whenever time or status changes
  useEffect(() => {
    drawCanvas();

    // Update Media Session Metadata (shows in PiP overlay)
    if ('mediaSession' in navigator) {
      const { hours, minutes, seconds } = formatTime(remainingTime);
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: isRunning ? 'Focusing...' : 'Timer Paused',
        artist: timeStr,
        album: 'Aeiouly Pomodoro',
        artwork: [
          { src: 'https://aeiouly.online/faavicon.ico', sizes: '96x96', type: 'image/x-icon' },
        ],
      });

      navigator.mediaSession.playbackState = isRunning ? 'playing' : 'paused';
    }
  }, [remainingTime, isRunning]);

  // Setup Media Session Actions (Play/Pause controls in PiP)
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (!usePomodoroStore.getState().isRunning) toggleTimer();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (usePomodoroStore.getState().isRunning) toggleTimer();
      });
    }
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
      }
    };
  }, [toggleTimer]);

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        // Close PiP
        await document.exitPictureInPicture();
        setIsPipActive(false);
      } else {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        // Ensure canvas has initial data drawn
        drawCanvas();

        // Capture stream from canvas (0 FPS is manual, 30 is auto.
        // We rely on react updates to redraw, but the stream needs a heartbeat)
        const stream = canvas.captureStream(30);
        video.srcObject = stream;

        // Needed for PiP to work
        await video.play();

        await video.requestPictureInPicture();
        setIsPipActive(true);
      }
    } catch (error) {
      console.error('Failed to enter PiP:', error);
      setIsPipActive(false);
    }
  };

  // Listen for external close (e.g., user clicks "X" on PiP window)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLeavePiP = () => setIsPipActive(false);
    video.addEventListener('leavepictureinpicture', onLeavePiP);

    return () => {
      video.removeEventListener('leavepictureinpicture', onLeavePiP);
    };
  }, []);

  return (
    <>
      <TooltipCustom content={isPipActive ? 'Thoát PiP' : 'Chế độ hình trong hình (PiP)'}>
        <Button variant={isPipActive ? 'secondary' : 'outline'} size="icon" onClick={togglePiP}>
          <PictureInPicture size={18} />
        </Button>
      </TooltipCustom>

      {/* Hidden Elements required for generation */}
      <div className="sr-only">
        {/* Set dimensions for the PiP window quality */}
        <canvas ref={canvasRef} width={500} height={300} />
        <video ref={videoRef} muted autoPlay playsInline />
      </div>
    </>
  );
};

export default React.memo(PomodoroPiP);
