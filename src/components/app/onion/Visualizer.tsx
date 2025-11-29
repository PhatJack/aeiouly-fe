import { FC, RefObject, useEffect, useRef } from 'react';

import { useTheme } from 'next-themes';

interface VisualizerProps {
  stream: MediaStream | null | undefined;
  isRecording: boolean;
  mediaRecorderRef: RefObject<MediaRecorder | null>;
}

export const Visualizer: FC<VisualizerProps> = ({ stream, isRecording, mediaRecorderRef }) => {
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !stream) return;

    // AudioContext
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // high detail
    analyser.smoothingTimeConstant = 0.75; // smooth waveform

    analyserRef.current = analyser;

    // Connect stream → analyser
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    // Canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) {
        cancelAnimationFrame(animationRef.current!);
        return;
      }

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';

      ctx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = (dataArray[i] - 128) / 128; // normalize -1 → 1

        // Noise filter
        if (Math.abs(v) < 0.02) v = 0;

        const y = HEIGHT / 2 + v * (HEIGHT / 3);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
    };

    if (isRecording) draw();
    else clearCanvas();

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [isRecording, stream, theme]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return <canvas ref={canvasRef} className="bg-background h-full w-full" />;
};
