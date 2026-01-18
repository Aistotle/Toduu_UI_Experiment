import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { AgeState } from '../TypographyLabPage';

interface AgeGravityProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
}

interface GravityWell {
  id: string;
  x: number;
  y: number;
  strength: number;
}

const IDEAL_WEIGHT_MIN = 480;
const IDEAL_WEIGHT_MAX = 580;
const MIN_WEIGHT = 100;
const MAX_WEIGHT = 900;

export const AgeGravity: React.FC<AgeGravityProps> = ({
  state,
  updateState,
  onComplete,
  prefersReducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const updateStateRef = useRef(updateState);

  // Keep refs in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
    updateStateRef.current = updateState;
  });

  const [wells, setWells] = useState<GravityWell[]>(() =>
    state.gravity.wellPositions.map(pos => ({
      id: pos.id,
      x: pos.x,
      y: pos.y,
      strength: 1,
    }))
  );

  const [letterWeight, setLetterWeight] = useState(state.gravity.letterWeight);
  const [letterY, setLetterY] = useState(0.5);
  const [draggingWell, setDraggingWell] = useState<string | null>(null);
  const [isStable, setIsStable] = useState(false);
  const [showCracks, setShowCracks] = useState(false);
  const [isFloatingAway, setIsFloatingAway] = useState(false);
  const stabilityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate weight based on gravity well positions
  const calculateWeight = useCallback((wellPositions: GravityWell[]): number => {
    const letterCenterX = 0.5;
    const letterCenterY = 0.5;

    let totalGravity = 0;

    for (const well of wellPositions) {
      const dx = well.x - letterCenterX;
      const dy = well.y - letterCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Inverse square law (clamped)
      const influence = Math.max(0, 1 - distance * 1.5);
      totalGravity += influence * well.strength * 300;
    }

    // Base weight plus gravity influence
    const weight = 200 + totalGravity;
    return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
  }, []);

  // Update physics
  useEffect(() => {
    const newWeight = calculateWeight(wells);
    setLetterWeight(newWeight);

    // Update letter vertical position based on weight
    const normalizedWeight = (newWeight - MIN_WEIGHT) / (MAX_WEIGHT - MIN_WEIGHT);
    const newY = 0.35 + normalizedWeight * 0.25;
    setLetterY(newY);

    // Check for extreme states
    setShowCracks(newWeight > 850);
    setIsFloatingAway(newWeight < 150);

    // Check for stability
    const isInIdealRange = newWeight >= IDEAL_WEIGHT_MIN && newWeight <= IDEAL_WEIGHT_MAX;
    const isNearCenter = Math.abs(newY - 0.5) < 0.1;

    if (isInIdealRange && isNearCenter && !isStable) {
      // Start stability timer (only if not already running)
      if (!stabilityTimerRef.current) {
        stabilityTimerRef.current = setTimeout(() => {
          setIsStable(true);
          updateStateRef.current('gravity', { isStabilized: true, letterWeight: newWeight });
          setTimeout(() => onCompleteRef.current(), 2000);
        }, 1500);
      }
    } else if (!isInIdealRange || !isNearCenter) {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    }
  }, [wells, calculateWeight, isStable]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
    };
  }, []);

  // Handle well dragging
  const handleWellPointerDown = useCallback((e: React.PointerEvent, wellId: string) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingWell(wellId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingWell || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setWells(prev =>
      prev.map(well =>
        well.id === draggingWell
          ? { ...well, x: Math.max(0.05, Math.min(0.95, x)), y: Math.max(0.05, Math.min(0.95, y)) }
          : well
      )
    );
  }, [draggingWell]);

  const handlePointerUp = useCallback(() => {
    setDraggingWell(null);
  }, []);

  // Weight indicator color
  const getWeightColor = () => {
    if (letterWeight < 200) return '#90A4AE'; // Too light - gray
    if (letterWeight > 800) return '#E53935'; // Too heavy - red
    if (letterWeight >= IDEAL_WEIGHT_MIN && letterWeight <= IDEAL_WEIGHT_MAX) return '#43A047'; // Ideal - green
    return '#1A1A1A'; // Normal - black
  };

  // Calculate shadow based on weight
  const shadowBlur = 8 + (letterWeight / MAX_WEIGHT) * 40;
  const shadowY = 4 + (letterWeight / MAX_WEIGHT) * 20;
  const shadowOpacity = 0.1 + (letterWeight / MAX_WEIGHT) * 0.25;

  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
        <div
          className="text-[25vw] cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 500,
            color: '#1A1A1A',
          }}
          onClick={onComplete}
        >
          A
        </div>
        <p className="absolute bottom-12 text-[#1A1A1A]/60 text-sm">
          Click to continue
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#FAFAFA' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#1A1A1A 1px, transparent 1px),
            linear-gradient(90deg, #1A1A1A 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* The Letter */}
      <div
        ref={letterRef}
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-300"
        style={{
          top: `${letterY * 100}%`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {/* Shadow */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            filter: `blur(${shadowBlur}px)`,
            transform: `translateY(${shadowY}px) scale(${0.9 + letterWeight / MAX_WEIGHT * 0.2})`,
            backgroundColor: `rgba(0, 0, 0, ${shadowOpacity})`,
            borderRadius: '50%',
          }}
        />

        {/* Letter */}
        <div
          className="text-[25vw] transition-all duration-150"
          style={{
            fontFamily: 'Fraunces, serif',
            fontVariationSettings: `"wght" ${letterWeight}, "opsz" 72`,
            color: isStable ? '#43A047' : '#1A1A1A',
            textShadow: isStable ? '0 0 40px rgba(67, 160, 71, 0.3)' : 'none',
          }}
        >
          A
        </div>

        {/* Weight indicator */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono px-2 py-1 rounded"
          style={{
            backgroundColor: getWeightColor(),
            color: '#FFFFFF',
          }}
        >
          {Math.round(letterWeight)}
        </div>
      </div>

      {/* Floor cracks when too heavy */}
      {showCracks && (
        <svg
          className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path
            d="M40 0 L42 8 L38 12 L40 20 M50 0 L48 6 L52 10 L50 15 L53 20 M60 0 L58 7 L62 14 L60 20"
            fill="none"
            stroke="#E53935"
            strokeWidth="0.3"
            opacity={Math.min(1, (letterWeight - 850) / 50)}
          />
        </svg>
      )}

      {/* Floating away warning */}
      {isFloatingAway && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[#90A4AE] text-sm animate-pulse">
          The letter is floating away...
        </div>
      )}

      {/* Gravity Wells */}
      {wells.map((well) => (
        <div
          key={well.id}
          className={`
            absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 cursor-grab
            ${draggingWell === well.id ? 'cursor-grabbing' : ''}
          `}
          style={{
            left: `${well.x * 100}%`,
            top: `${well.y * 100}%`,
          }}
          onPointerDown={(e) => handleWellPointerDown(e, well.id)}
        >
          {/* Ripple effect */}
          <div
            className="absolute inset-0 rounded-full border border-[#1A1A1A]/10 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div
            className="absolute inset-2 rounded-full border border-[#1A1A1A]/15"
          />
          <div
            className="absolute inset-4 rounded-full border border-[#1A1A1A]/20"
          />

          {/* Center point */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1A1A1A]/30"
          />

          {/* Gravity visualization lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="url(#gravityGradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: '10s' }}
            />
            <defs>
              <radialGradient id="gravityGradient">
                <stop offset="0%" stopColor="rgba(26, 26, 26, 0.2)" />
                <stop offset="100%" stopColor="rgba(26, 26, 26, 0)" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Stability celebration */}
      {isStable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[60vw] h-[60vw] rounded-full border-2 border-[#43A047]/20 animate-ping" />
          <div className="text-center mt-[50vh]">
            <p className="text-[#43A047] text-lg">Equilibrium achieved.</p>
            <p className="text-[#1A1A1A]/60 text-sm mt-2">Weight grounds the letter.</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isStable && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#1A1A1A]/60 text-sm">
            Drag the gravity wells to find balance
          </p>
          <p className="text-[#1A1A1A]/40 text-xs mt-1">
            Target: {IDEAL_WEIGHT_MIN}-{IDEAL_WEIGHT_MAX}
          </p>
        </div>
      )}
    </div>
  );
};
