import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AgeState } from '../TypographyLabPage';

interface AgeTensionProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
}

type Personality = 'introvert' | 'extrovert' | 'neutral';

interface LetterData {
  char: string;
  personality: Personality;
  idealSpacing: number; // Ideal gap to next letter
  currentOffset: number;
  isHappy: boolean;
}

// Letter personalities for "BREATHE"
const LETTER_CONFIG: LetterData[] = [
  { char: 'B', personality: 'extrovert', idealSpacing: 8, currentOffset: 0, isHappy: false },
  { char: 'R', personality: 'neutral', idealSpacing: 4, currentOffset: 0, isHappy: false },
  { char: 'E', personality: 'introvert', idealSpacing: 12, currentOffset: 0, isHappy: false },
  { char: 'A', personality: 'extrovert', idealSpacing: 6, currentOffset: 0, isHappy: false },
  { char: 'T', personality: 'introvert', idealSpacing: 14, currentOffset: 0, isHappy: false },
  { char: 'H', personality: 'neutral', idealSpacing: 8, currentOffset: 0, isHappy: false },
  { char: 'E', personality: 'extrovert', idealSpacing: 0, currentOffset: 0, isHappy: false },
];

const PERSONALITY_COLORS: Record<Personality, { bg: string; glow: string }> = {
  introvert: { bg: 'rgba(144, 164, 174, 0.15)', glow: '#90A4AE' }, // Cool gray-blue
  extrovert: { bg: 'rgba(255, 112, 67, 0.15)', glow: '#FF7043' }, // Warm orange
  neutral: { bg: 'rgba(76, 175, 80, 0.15)', glow: '#4CAF50' }, // Natural green
};

const TOLERANCE = 6; // How close to ideal spacing is acceptable

export const AgeTension: React.FC<AgeTensionProps> = ({
  state,
  updateState,
  onComplete,
  prefersReducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const updateStateRef = useRef(updateState);

  // Keep refs in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
    updateStateRef.current = updateState;
  });
  const [letters, setLetters] = useState<LetterData[]>(() =>
    LETTER_CONFIG.map(l => ({
      ...l,
      // Start with chaotic spacing
      currentOffset: (Math.random() - 0.5) * 40,
    }))
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartOffset, setDragStartOffset] = useState(0);
  const [allHappy, setAllHappy] = useState(false);
  const [breathePhase, setBreathePhase] = useState(0);

  // Check if letters are happy with their spacing
  const checkHappiness = useCallback((letterData: LetterData[]): LetterData[] => {
    return letterData.map((letter, index) => {
      if (index === letterData.length - 1) {
        // Last letter is always happy
        return { ...letter, isHappy: true };
      }

      const nextLetter = letterData[index + 1];
      const actualSpacing = nextLetter.currentOffset - letter.currentOffset;
      const spacingDiff = Math.abs(actualSpacing - letter.idealSpacing);

      // Consider personality for happiness
      let isHappy = spacingDiff < TOLERANCE;

      if (letter.personality === 'introvert') {
        // Introverts are unhappy when too close
        isHappy = isHappy && actualSpacing >= letter.idealSpacing - 2;
      } else if (letter.personality === 'extrovert') {
        // Extroverts are unhappy when too far
        isHappy = isHappy && actualSpacing <= letter.idealSpacing + 4;
      }

      return { ...letter, isHappy };
    });
  }, []);

  // Update happiness whenever letters change
  useEffect(() => {
    const updatedLetters = checkHappiness(letters);
    const hasChanged = updatedLetters.some((l, i) => l.isHappy !== letters[i].isHappy);
    if (hasChanged) {
      setLetters(updatedLetters);
    }

    // Check if all are happy
    const nowAllHappy = updatedLetters.every(l => l.isHappy);
    if (nowAllHappy && !allHappy) {
      setAllHappy(true);
      updateStateRef.current('tension', { isHarmonious: true });
      setTimeout(() => onCompleteRef.current(), 3000);
    }
  }, [letters, checkHappiness, allHappy]);

  // Breathing animation when all happy
  useEffect(() => {
    if (!allHappy || prefersReducedMotion) return;

    let frame: number;
    let start = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;
      setBreathePhase(Math.sin(elapsed * 0.8) * 0.5 + 0.5);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [allHappy, prefersReducedMotion]);

  // Handle letter dragging
  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIndex(index);
    setDragStartX(e.clientX);
    setDragStartOffset(letters[index].currentOffset);
  }, [letters]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (draggingIndex === null) return;

    const deltaX = e.clientX - dragStartX;
    const newOffset = dragStartOffset + deltaX * 0.5;

    setLetters(prev =>
      prev.map((letter, i) =>
        i === draggingIndex
          ? { ...letter, currentOffset: newOffset }
          : letter
      )
    );
  }, [draggingIndex, dragStartX, dragStartOffset]);

  const handlePointerUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  // Get visual state for a letter
  const getLetterStyle = (letter: LetterData, index: number) => {
    const colors = PERSONALITY_COLORS[letter.personality];
    const isBeingDragged = draggingIndex === index;

    // Determine conflict state
    let conflictLevel = 0;
    if (index < letters.length - 1) {
      const nextLetter = letters[index + 1];
      const actualSpacing = nextLetter.currentOffset - letter.currentOffset;
      const spacingDiff = actualSpacing - letter.idealSpacing;

      if (letter.personality === 'introvert' && spacingDiff < -TOLERANCE) {
        conflictLevel = Math.min(1, Math.abs(spacingDiff) / 20);
      } else if (letter.personality === 'extrovert' && spacingDiff > TOLERANCE * 2) {
        conflictLevel = Math.min(1, spacingDiff / 30);
      }
    }

    const breatheScale = allHappy ? 1 + breathePhase * 0.02 : 1;
    const breatheSpacing = allHappy ? breathePhase * 4 : 0;

    return {
      transform: `translateX(${letter.currentOffset + breatheSpacing * (index - 3)}px) scale(${isBeingDragged ? 1.05 : breatheScale})`,
      backgroundColor: letter.isHappy ? colors.bg : conflictLevel > 0.3 ? 'rgba(255, 112, 67, 0.2)' : 'transparent',
      boxShadow: letter.isHappy
        ? `0 0 20px ${colors.glow}40`
        : conflictLevel > 0.3
          ? '0 0 10px rgba(255, 112, 67, 0.3)'
          : 'none',
      animation: conflictLevel > 0.5 && !prefersReducedMotion
        ? 'shake 0.1s infinite'
        : undefined,
    };
  };

  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-[#FFF8F0]">
        <div
          className="text-[12vw] cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            color: '#2D2D2D',
            letterSpacing: '0.05em',
          }}
          onClick={onComplete}
        >
          BREATHE
        </div>
        <p className="absolute bottom-12 text-[#2D2D2D]/60 text-sm">
          Click to continue
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FFF8F0' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>

      {/* Personality legend */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PERSONALITY_COLORS.introvert.glow }} />
          <span className="text-[#2D2D2D]/60">Introvert (needs space)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PERSONALITY_COLORS.extrovert.glow }} />
          <span className="text-[#2D2D2D]/60">Extrovert (needs closeness)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PERSONALITY_COLORS.neutral.glow }} />
          <span className="text-[#2D2D2D]/60">Neutral (adaptable)</span>
        </div>
      </div>

      {/* The Word */}
      <div className="relative flex items-center justify-center">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`
              relative cursor-grab select-none
              text-[min(14vw,140px)] font-semibold
              transition-all duration-200
              ${draggingIndex === index ? 'cursor-grabbing z-10' : ''}
            `}
            style={{
              fontFamily: 'Fraunces, serif',
              color: letter.isHappy ? '#2D2D2D' : '#2D2D2D',
              ...getLetterStyle(letter, index),
              padding: '0 0.1em',
              borderRadius: '8px',
            }}
            onPointerDown={(e) => handlePointerDown(e, index)}
          >
            {letter.char}

            {/* Personality aura */}
            <div
              className={`
                absolute inset-0 rounded-lg pointer-events-none
                transition-opacity duration-300
              `}
              style={{
                border: `2px solid ${PERSONALITY_COLORS[letter.personality].glow}`,
                opacity: letter.isHappy ? 0.6 : 0.2,
              }}
            />

            {/* Happy indicator */}
            {letter.isHappy && index < letters.length - 1 && (
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg"
                style={{ color: PERSONALITY_COLORS[letter.personality].glow }}
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Connection lines showing relationships */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {letters.slice(0, -1).map((letter, index) => {
          const nextLetter = letters[index + 1];
          const startX = window.innerWidth / 2 + letter.currentOffset + index * 80 - 240;
          const endX = window.innerWidth / 2 + nextLetter.currentOffset + (index + 1) * 80 - 240;
          const y = window.innerHeight / 2;

          return (
            <line
              key={index}
              x1={startX + 40}
              y1={y}
              x2={endX - 40}
              y2={y}
              stroke={letter.isHappy ? PERSONALITY_COLORS[letter.personality].glow : '#2D2D2D'}
              strokeWidth={letter.isHappy ? 2 : 1}
              strokeDasharray={letter.isHappy ? undefined : '4 4'}
              opacity={letter.isHappy ? 0.4 : 0.15}
            />
          );
        })}
      </svg>

      {/* Harmony celebration */}
      {allHappy && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center mt-[40vh]">
            <p className="text-[#4CAF50] text-lg">Harmony achieved.</p>
            <p className="text-[#2D2D2D]/60 text-sm mt-2">
              Each letter found its place.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!allHappy && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#2D2D2D]/60 text-sm">
            Drag letters to find the spacing each personality needs
          </p>
          <p className="text-[#2D2D2D]/40 text-xs mt-1">
            Introverts need more space. Extroverts crave closeness.
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {letters.slice(0, -1).map((letter, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${letter.isHappy ? 'scale-110' : 'scale-100'}
            `}
            style={{
              backgroundColor: letter.isHappy
                ? PERSONALITY_COLORS[letter.personality].glow
                : '#2D2D2D20',
            }}
          />
        ))}
      </div>
    </div>
  );
};
