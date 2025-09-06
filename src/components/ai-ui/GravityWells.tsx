'use client';

import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface GravityWellsProps {
  /** Number of stars/particles in the background */
  particles?: number;
  /** How strong the gravity wells pull */
  strength?: number;
  /** How large the gravity wells are */
  radius?: number;
  /** Fade-out duration (ms) for wells */
  decay?: number;
  className?: string;
  /** Particle size range */
  particleSize?: [number, number];
  /** Particle opacity */
  particleOpacity?: number;
}

interface Well {
  x: number;
  y: number;
  createdAt: number;
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function GravityWells({
  particles = 300,
  strength = 100,
  radius = 100,
  decay = 2500,
  className,
  particleSize = [0.5, 2.5],
  particleOpacity = 0.8,
}: GravityWellsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wells = useRef<Well[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const circleSizeRef = useRef<number>(radius);

  const lastWellCreationRef = useRef<number>(0);
  const gradientCacheRef = useRef<Map<string, CanvasGradient>>(new Map());
  const frameCountRef = useRef<number>(0);

  const initParticles = useCallback(
    (width: number, height: number) => {
      return Array.from(
        { length: particles },
        (): Particle => ({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          size: Math.random() * (particleSize[1] - particleSize[0]) + particleSize[0],
          opacity: Math.random() * particleOpacity * 0.5 + particleOpacity * 0.5,
          speed: 0.2 + Math.random() * 0.8,
        })
      );
    },
    [particles, particleSize, particleOpacity]
  );

  const getDistanceSquared = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  }, []);

  const getOrCreateGradient = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) => {
      const key = `${Math.round(x / 10)}_${Math.round(y / 10)}_${Math.round(r)}_${Math.round(alpha * 100)}`;

      if (!gradientCacheRef.current.has(key)) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${0.5 * alpha})`);
        gradient.addColorStop(0.7, `rgba(168, 85, 247, ${0.2 * alpha})`);
        gradient.addColorStop(1, 'transparent');
        gradientCacheRef.current.set(key, gradient);

        if (gradientCacheRef.current.size > 100) {
          const firstKey = gradientCacheRef.current.keys().next().value || '';
          gradientCacheRef.current.delete(firstKey);
        }
      }

      return gradientCacheRef.current.get(key)!;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initializeParticles = () => {
      const currentWidth = canvas.width;
      const currentHeight = canvas.height;
      particlesRef.current = initParticles(currentWidth, currentHeight);
    };

    initializeParticles();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initializeParticles();
      gradientCacheRef.current.clear();
    };

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();

      if (now - lastWellCreationRef.current < 16) {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (!mousePosRef.current) {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        lastWellCreationRef.current = now;
        return;
      }

      // Calculate mouse velocity
      const velocityX = e.clientX - (mousePosRef.current?.x ?? e.clientX);
      const velocityY = e.clientY - (mousePosRef.current?.y ?? e.clientY);
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

      if (speed > 2) {
        // Adjust circle size based on mouse speed (inverse relationship)
        const targetSize = Math.max(10, radius * 2 - Math.min(speed, radius * 1.5));
        circleSizeRef.current += (targetSize - circleSizeRef.current) * 0.1;

        // Add a well at the current mouse position
        wells.current.push({
          x: e.clientX,
          y: e.clientY,
          createdAt: now,
          vx: velocityX * 0.3,
          vy: velocityY * 0.3,
        });

        if (wells.current.length > 20) {
          wells.current.shift();
        }

        lastWellCreationRef.current = now;
      }

      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const now = Date.now();

        if (now - lastWellCreationRef.current < 16) return;

        wells.current.push({
          x: touch.clientX,
          y: touch.clientY,
          createdAt: now,
          vx: 0,
          vy: 0,
        });

        if (wells.current.length > 20) {
          wells.current.shift();
        }

        lastWellCreationRef.current = now;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    const updateWells = (deltaTime: number) => {
      const now = Date.now();

      wells.current = wells.current.filter((w) => {
        const age = (now - w.createdAt) / decay;
        if (age >= 1) return false;

        w.x += w.vx * deltaTime * 0.1;
        w.y += w.vy * deltaTime * 0.1;

        w.vx *= 0.92;
        w.vy *= 0.92;

        return true;
      });
    };

    const draw = (time: number) => {
      const deltaTime = time - (lastTimeRef.current || time);
      lastTimeRef.current = time;
      frameCountRef.current++;

      if (frameCountRef.current % 2 === 0) {
        ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);
      }

      updateWells(deltaTime);

      const activeWells = wells.current;
      const maxInfluenceRadius = circleSizeRef.current;

      particlesRef.current.forEach((p) => {
        let dx = 0;
        let dy = 0;
        let totalWeight = 0;
        let hasInfluence = false;

        for (let i = 0; i < activeWells.length; i++) {
          const w = activeWells[i];
          const age = (Date.now() - w.createdAt) / decay;
          const currentRadius = circleSizeRef.current * (1 - age * 0.5);

          if (Math.abs(w.x - p.x) > currentRadius || Math.abs(w.y - p.y) > currentRadius) {
            continue;
          }

          const distSq = getDistanceSquared(p.x, p.y, w.x, w.y);
          const dist = Math.sqrt(distSq);

          if (dist < currentRadius) {
            hasInfluence = true;
            const influence = (1 - age) * strength;
            const normalizedDist = dist / currentRadius;
            const force = influence * (1 - normalizedDist) * (1 - normalizedDist);

            dx += ((w.x - p.x) / (dist + 0.1)) * force;
            dy += ((w.y - p.y) / (dist + 0.1)) * force;
            totalWeight += influence;
          }
        }

        // Apply movement with easing and return to base position
        if (hasInfluence && totalWeight > 0) {
          p.x += (dx / totalWeight) * p.speed;
          p.y += (dy / totalWeight) * p.speed;
        } else {
          p.x += (p.baseX - p.x) * 0.05;
          p.y += (p.baseY - p.y) * 0.05;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      wells.current.forEach((w) => {
        const age = (Date.now() - w.createdAt) / decay;
        const alpha = Math.sin(age * Math.PI) * 0.5;
        const r = radius * (1 - age * 0.7);

        // Use cached gradient
        const gradient = getOrCreateGradient(ctx, w.x, w.y, r, alpha);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(w.x, w.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (age < 0.3) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - age * 3) * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(w.x, w.y, r * 0.9, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleTouch);
      gradientCacheRef.current.clear();
    };
  }, [strength, radius, decay, initParticles, getDistanceSquared, getOrCreateGradient]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 h-full w-full',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        'pointer-events-none select-none',
        className
      )}
    />
  );
}
