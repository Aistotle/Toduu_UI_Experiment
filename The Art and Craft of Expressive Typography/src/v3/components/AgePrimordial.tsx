import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createNoise2D } from 'simplex-noise';
import type { AgeState } from '../TypographyLabPage';

interface AgePrimordialProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
}

// Letter "A" path for particle attraction (normalized 0-1 coordinates)
const LETTER_A_POINTS = [
  // Left stroke
  { x: 0.15, y: 1.0 }, { x: 0.35, y: 0.5 }, { x: 0.5, y: 0.0 },
  // Right stroke
  { x: 0.5, y: 0.0 }, { x: 0.65, y: 0.5 }, { x: 0.85, y: 1.0 },
  // Crossbar
  { x: 0.28, y: 0.65 }, { x: 0.72, y: 0.65 },
  // Fill points
  { x: 0.5, y: 0.15 }, { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 },
  { x: 0.35, y: 0.7 }, { x: 0.65, y: 0.7 }, { x: 0.5, y: 0.5 },
  { x: 0.45, y: 0.3 }, { x: 0.55, y: 0.3 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  isAttracted: boolean;
  noiseOffsetX: number;
  noiseOffsetY: number;
}

const PARTICLE_COUNT = 2000;
const ATTRACTION_THRESHOLD = 0.15;
const CRYSTALLIZATION_TIME = 2000;

export const AgePrimordial: React.FC<AgePrimordialProps> = ({
  state,
  updateState,
  onComplete,
  prefersReducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const updateStateRef = useRef(updateState);

  // Keep refs in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
    updateStateRef.current = updateState;
  });
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const noiseRef = useRef(createNoise2D());
  const frameRef = useRef(0);
  const movementRef = useRef(0);
  const attractionPhaseRef = useRef(false);
  const crystallizingRef = useRef(false);
  const crystallizeStartRef = useRef(0);
  const holdingRef = useRef(false);
  const holdStartRef = useRef(0);

  const [phase, setPhase] = useState<'chaos' | 'emerging' | 'crystallizing' | 'complete'>('chaos');
  const [holdProgress, setHoldProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const targetPoint = LETTER_A_POINTS[i % LETTER_A_POINTS.length];
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        targetX: targetPoint.x + (Math.random() - 0.5) * 0.08,
        targetY: targetPoint.y + (Math.random() - 0.5) * 0.08,
        size: 1 + Math.random() * 2,
        alpha: 0.02 + Math.random() * 0.04,
        isAttracted: false,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Show hint after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;

      mouseRef.current = {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
        active: true,
      };

      // Track movement for emergence trigger
      const dx = mouseRef.current.x - prevX;
      const dy = mouseRef.current.y - prevY;
      movementRef.current += Math.sqrt(dx * dx + dy * dy);

      // Trigger emergence phase after enough movement
      if (movementRef.current > 2 && phase === 'chaos') {
        attractionPhaseRef.current = true;
        setPhase('emerging');
        setShowHint(false);
      }
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      if (phase === 'emerging') {
        holdingRef.current = true;
        holdStartRef.current = performance.now();
      }
    };

    const handleUp = () => {
      holdingRef.current = false;
      if (phase !== 'crystallizing' && phase !== 'complete') {
        setHoldProgress(0);
      }
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('touchmove', handleMove);
    container.addEventListener('mousedown', handleDown);
    container.addEventListener('touchstart', handleDown);
    container.addEventListener('mouseup', handleUp);
    container.addEventListener('touchend', handleUp);
    container.addEventListener('mouseleave', handleUp);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('touchmove', handleMove);
      container.removeEventListener('mousedown', handleDown);
      container.removeEventListener('touchstart', handleDown);
      container.removeEventListener('mouseup', handleUp);
      container.removeEventListener('touchend', handleUp);
      container.removeEventListener('mouseleave', handleUp);
    };
  }, [phase]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const noise = noiseRef.current;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const t = time * 0.001;

      // Update hold progress
      if (holdingRef.current && phase === 'emerging') {
        const elapsed = time - holdStartRef.current;
        const progress = Math.min(elapsed / CRYSTALLIZATION_TIME, 1);
        setHoldProgress(progress);

        if (progress >= 1 && !crystallizingRef.current) {
          crystallizingRef.current = true;
          crystallizeStartRef.current = time;
          setPhase('crystallizing');
        }
      }

      // Calculate letter center for attraction
      const letterCenterX = 0.5;
      const letterCenterY = 0.5;
      const letterSize = Math.min(rect.width, rect.height) * 0.4;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (phase === 'chaos' || phase === 'emerging') {
          // Brownian motion with noise
          const noiseX = noise(p.noiseOffsetX + t * 0.3, i * 0.01) * 0.003;
          const noiseY = noise(p.noiseOffsetY + t * 0.3, i * 0.01) * 0.003;
          p.vx += noiseX;
          p.vy += noiseY;

          // Mouse attraction
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ATTRACTION_THRESHOLD) {
              const force = (1 - dist / ATTRACTION_THRESHOLD) * 0.02;
              p.vx += dx * force;
              p.vy += dy * force;
              p.isAttracted = true;
            }
          }

          // Letter formation attraction in emerging phase
          if (attractionPhaseRef.current) {
            const targetX = letterCenterX + (p.targetX - 0.5) * (letterSize / rect.width);
            const targetY = letterCenterY + (p.targetY - 0.5) * (letterSize / rect.height);

            const dx = targetX - p.x;
            const dy = targetY - p.y;

            // Gradual attraction based on hold progress
            const attractStrength = holdProgress * 0.05 + 0.005;
            p.vx += dx * attractStrength;
            p.vy += dy * attractStrength;
          }

          // Damping
          p.vx *= 0.96;
          p.vy *= 0.96;

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;
        } else if (phase === 'crystallizing') {
          // Lock particles to their target positions
          const targetX = letterCenterX + (p.targetX - 0.5) * (letterSize / rect.width);
          const targetY = letterCenterY + (p.targetY - 0.5) * (letterSize / rect.height);

          const progress = Math.min((time - crystallizeStartRef.current) / 1000, 1);
          p.x += (targetX - p.x) * 0.15;
          p.y += (targetY - p.y) * 0.15;
          p.alpha = 0.02 + progress * 0.4;

          if (progress >= 1 && phase !== 'complete') {
            setPhase('complete');
            updateStateRef.current('primordial', { isCrystallized: true });
            setTimeout(() => onCompleteRef.current(), 1500);
          }
        }

        // Draw particle
        const screenX = p.x * rect.width;
        const screenY = p.y * rect.height;

        let alpha = p.alpha;
        let size = p.size;

        if (phase === 'crystallizing' || phase === 'complete') {
          alpha = Math.min(0.6, p.alpha * 3);
          size = p.size * 1.5;
        }

        // Glow effect
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 3);
        gradient.addColorStop(0, `rgba(240, 230, 211, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 0, ${alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.beginPath();
        ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 230, 211, ${alpha * 2})`;
        ctx.fill();
      }

      // Draw emerging letter outline when crystallizing
      if (phase === 'crystallizing' || phase === 'complete') {
        const progress = phase === 'complete' ? 1 : Math.min((time - crystallizeStartRef.current) / 1000, 1);
        ctx.save();
        ctx.globalAlpha = progress * 0.8;
        ctx.font = `${letterSize * 1.8}px Fraunces`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#F0E6D3';
        ctx.fillText('A', rect.width / 2, rect.height / 2);
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      // Static version for reduced motion
      ctx.font = `${Math.min(rect.width, rect.height) * 0.5}px Fraunces`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F0E6D3';
      ctx.fillText('A', rect.width / 2, rect.height / 2);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [phase, holdProgress, prefersReducedMotion]);

  // Reduced motion: show static letter with click to continue
  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-[#0A0A0B]">
        <div
          className="text-[30vw] font-serif text-[#F0E6D3] cursor-pointer hover:text-[#FFD700] transition-colors"
          style={{ fontFamily: 'Fraunces, serif' }}
          onClick={onComplete}
        >
          A
        </div>
        <p className="absolute bottom-12 text-[#F0E6D3]/60 text-sm">
          Click to continue
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full cursor-crosshair overflow-hidden"
      style={{ backgroundColor: '#0A0A0B' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Hint text */}
      {showHint && phase === 'chaos' && (
        <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#F0E6D3]/40 text-sm animate-pulse">
          Move through the void...
        </p>
      )}

      {/* Emerging phase instruction */}
      {phase === 'emerging' && !holdingRef.current && (
        <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#F0E6D3]/60 text-sm">
          Press and hold to crystallize
        </p>
      )}

      {/* Hold progress indicator */}
      {holdingRef.current && phase === 'emerging' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#F0E6D3]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFD700] transition-all duration-100"
            style={{ width: `${holdProgress * 100}%` }}
          />
        </div>
      )}

      {/* Crystallizing feedback */}
      {phase === 'crystallizing' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-[#FFD700]/20 animate-ping" />
        </div>
      )}

      {/* Complete state */}
      {phase === 'complete' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[#F0E6D3]/80 text-lg mt-[45vh]">
              From chaos, form emerges.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
