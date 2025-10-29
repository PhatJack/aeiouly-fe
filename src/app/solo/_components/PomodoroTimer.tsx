'use client';

import React, { useEffect, useRef, useState } from 'react';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { usePomodoroStore } from '@/hooks/use-pomodoro-store';
import { useSoloStore } from '@/hooks/use-solo-store';
import { UrlToEmbeded } from '@/lib/utils';

import { PictureInPicture } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const { backgroundURL } = useSoloStore();
  const { isFocusMode, remainingTime, formatTime, isRunning, toggleTimer, resetTimer } =
    usePomodoroStore();

  const [isPip, setIsPip] = useState(false);
  const pipWindowRef = useRef<Window | null>(null);
  const intervalRef = useRef<number | null>(null);
  const checkPipClosedRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Handle PiP mode
  const enterPip = async () => {
    // Check if we have a valid background URL
    if (!backgroundURL || !UrlToEmbeded(backgroundURL)?.videoId) {
      console.error('Invalid or missing YouTube URL');
      return;
    }

    const videoId = UrlToEmbeded(backgroundURL)?.videoId;
    const { hours, minutes, seconds } = formatTime(remainingTime);
    console.log('hour', hours, 'minute', minutes, 'second', seconds);
    const pipHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pomodoro | Ztudy</title>
					<link rel="icon" type="image/x-icon" href="https://ztudy.io.vn/favicon.ico">
          <style>
					@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap);body,button{font-family:Poppins,sans-serif}#reset,#toggle,.timer,body{color:#fff}#reset:hover,#toggle:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.3)}body{margin:0;background:#000;min-width:533px;min-height:296px;overflow:hidden}.container{display:flex;flex-direction:column;height:100vh;position:relative}#player,.overlay{top:0;left:0;height:100%}#player,.controls,.overlay{position:absolute;width:100%}#player{z-index:1;pointer-events:none}.overlay{background:rgba(0,0,0,.3);z-index:2;backdrop-filter:blur(2px)}.controls{top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;text-align:center}.timer-container{display:inline-block;background:rgba(30,30,30,.6);border-radius:24px;padding:20px 40px;box-shadow:0 8px 32px rgba(0,0,0,.2);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.1);margin-bottom:30px}.timer{font-size:80px;font-weight:600;letter-spacing:2px;text-shadow:0 2px 10px rgba(0,0,0,.3);margin:0}.button-container{display:flex;justify-content:center;gap:20px}button{padding:12px 30px;font-size:16px;font-weight:500;cursor:pointer;border:none;border-radius:50px;transition:.3s;box-shadow:0 4px 12px rgba(0,0,0,.2);letter-spacing:1px}#toggle{background:linear-gradient(135deg,#4caf50,#2e7d32)}#toggle:hover{background:linear-gradient(135deg,#43a047,#2e7d32)}#reset{background:linear-gradient(135deg,#424242,#212121)}#reset:hover{background:linear-gradient(135deg,#383838,#212121)}.title{font-size:24px;font-weight:300;margin-bottom:40px;letter-spacing:4px;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,.5)}@media (max-width:768px){.timer{font-size:60px}.timer-container{padding:15px 30px}button{padding:10px 24px;font-size:14px}}
					</style>
        </head>
        <body>
          <div class="container">
						<div id="player"></div>
						<div class="overlay"></div>
					<div class="controls">
						<h1 class="title">Pomodoro Timer</h1>
						<div class="timer-container">
						<div class="timer" id="timer">25:00</div>
					</div>
					<div class="button-container">
						<button id="toggle">Start</button>
						<button id="reset">Reset</button>
					</div>
					</div>
				</div>
					<script>
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
					</script>
          <script>
            let player;
            function onYouTubeIframeAPIReady() {
              player = new YT.Player('player', {
							width:533,
							height:296,
                videoId: '${videoId}',
                playerVars: {
                  playsinline: 1,
                  enablejsapi: 1,
                  autoplay: 1,
                  controls: 0,
                  showinfo: 0,
                  mute: 1,
                  rel: 0,
                  loop: 1,
                  playlist: '${videoId}',
                },
                events: { 
                  onReady: function(event) {
                    event.target.playVideo();
                    console.log("YouTube player ready");
                  },
                  onError: function(event) {
                    console.error("YouTube player error:", event.data);
                  }
                }
              });
            }
            document.getElementById('toggle').addEventListener('click', function() {
              window.opener.postMessage({ action: 'toggle' }, '*');
            });
            
            document.getElementById('reset').addEventListener('click', function() {
              window.opener.postMessage({ action: 'reset' }, '*');
            });
            
            window.addEventListener('message', function(e) {
              console.log("Received message from main window:", e.data);
              if (e.data.time) {
                console.log("Received time:", e.data.time);
                document.getElementById('timer').textContent = e.data.time;
              }
              if (e.data.toggleText) document.getElementById('toggle').textContent = e.data.toggleText;
            });
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([pipHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Open the window with specific parameters to maximize "always on top" behavior
    // Note: True "always on top" is limited by browser security, but we can optimize for best appearance
    pipWindowRef.current = window.open(
      url,
      '_blank',
      'width=350,height=300,popup=yes,alwaysRaised=yes,alwaysOnTop=yes,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no,titlebar=no'
    );

    if (!pipWindowRef.current) {
      console.error('Failed to open PIP window. Check if popup blockers are enabled.');
      return;
    }

    // Attempt to make the window more PIP-like by periodically focusing it
    if (pipWindowRef.current.focus) {
      pipWindowRef.current.focus();

      // Create a periodic focus attempt for the PIP window
      const focusInterval = setInterval(() => {
        if (pipWindowRef.current && !pipWindowRef.current.closed) {
          pipWindowRef.current.focus();
        } else {
          clearInterval(focusInterval);
        }
      }, 5000); // Try to refocus every 5 seconds

      // Clean up the interval when the PIP is closed
      const originalSetInterval = checkPipClosedRef.current;
      checkPipClosedRef.current = setInterval(() => {
        if (pipWindowRef.current?.closed) {
          setIsPip(false);
          if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
          if (checkPipClosedRef.current) clearInterval(checkPipClosedRef.current);
          clearInterval(focusInterval);
          window.removeEventListener('message', messageHandler);
          URL.revokeObjectURL(url);
        }
      }, 1000);
    }

    setIsPip(true);

    // Message handler for the main window
    const messageHandler = (event: MessageEvent) => {
      if (event.data.action === 'toggle') {
        toggleTimer();
      }
      if (event.data.action === 'reset') {
        resetTimer();
      }
    };

    window.addEventListener('message', messageHandler);

    // Clean up any existing intervals
    if (checkPipClosedRef.current) clearInterval(checkPipClosedRef.current);
    if (intervalRef.current) cancelAnimationFrame(intervalRef.current);

    // Check if PiP window is closed
    checkPipClosedRef.current = setInterval(() => {
      if (pipWindowRef.current?.closed) {
        setIsPip(false);
        if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
        if (checkPipClosedRef.current) clearInterval(checkPipClosedRef.current);
        window.removeEventListener('message', messageHandler);
        URL.revokeObjectURL(url);
      }
    }, 1000);
  };

  // Update PiP window with current time
  const updatePipWindow = () => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      const currentFormattedTime = formatTime(remainingTime);
      const timeString = `${String(currentFormattedTime.hours).padStart(2, '0')}:${String(
        currentFormattedTime.minutes
      ).padStart(2, '0')}:${String(currentFormattedTime.seconds).padStart(2, '0')}`;

      pipWindowRef.current.postMessage(
        {
          time: timeString,
          toggleText: isRunning ? 'Pause' : 'Start',
        },
        '*'
      );
      lastUpdateTimeRef.current = Date.now();
    }
  };

  // Use requestAnimationFrame for more reliable timing
  useEffect(() => {
    let animationFrameId: number | null = null;

    if (isPip) {
      const updateFrame = () => {
        const now = Date.now();
        // Update at least every 500ms or when remainingTime changes
        if (now - lastUpdateTimeRef.current >= 500) {
          updatePipWindow();
        }
        animationFrameId = requestAnimationFrame(updateFrame);
      };

      animationFrameId = requestAnimationFrame(updateFrame);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPip, remainingTime, isRunning]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isPip) {
        // When tab becomes visible again, immediately update PIP window
        updatePipWindow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPip, remainingTime, isRunning]);

  // Force update when timer state changes
  useEffect(() => {
    if (isPip) {
      updatePipWindow();
    }
  }, [remainingTime, isRunning]);

  return (
    <>
      <TooltipCustom content="Pure in Picture Mode">
        <Button
          variant={isPip ? 'secondary' : 'outline'}
          size="icon"
          onClick={enterPip}
          disabled={isPip}
        >
          <PictureInPicture size={18} />
        </Button>
      </TooltipCustom>
    </>
  );
};

export default React.memo(PomodoroTimer);
