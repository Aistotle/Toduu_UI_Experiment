import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { AgeState, AgeId } from '../TypographyLabPage';

interface AgeCreationProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
  goToAge: (age: AgeId) => void;
}

interface LetterState {
  char: string;
  x: number;
  weight: number;
  baseWeight: number;
  hue: number;
  offsetY: number;
  rotation: number;
  spacing: number;
}

// Get a color palette from a word
const getWordPalette = (word: string): { primary: string; secondary: string; bg: string } => {
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  return {
    primary: `hsl(${hue}, 70%, 50%)`,
    secondary: `hsl(${(hue + 180) % 360}, 60%, 60%)`,
    bg: `hsl(${hue}, 10%, 98%)`,
  };
};

export const AgeCreation: React.FC<AgeCreationProps> = ({
  state,
  updateState,
  onComplete,
  prefersReducedMotion,
  goToAge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userWord, setUserWord] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [letters, setLetters] = useState<LetterState[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isPerforming, setIsPerforming] = useState(false);
  const [performanceProgress, setPerformanceProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [breathePhase, setBreathePhase] = useState(0);
  const animationRef = useRef<number | null>(null);

  const palette = useMemo(() => getWordPalette(userWord || 'CREATE'), [userWord]);

  // Handle word submission
  const handleSubmit = useCallback(() => {
    if (userWord.length < 2) return;

    const newLetters: LetterState[] = userWord.toUpperCase().split('').map((char, i) => ({
      char,
      x: i,
      weight: 400,
      baseWeight: 400,
      hue: (i * 30) % 360,
      offsetY: 0,
      rotation: 0,
      spacing: 0,
    }));

    setLetters(newLetters);
    setIsRevealed(true);
    setShowParticles(true);

    updateState('creation', { userWord: userWord.toUpperCase() });

    // Hide particles after intro
    setTimeout(() => setShowParticles(false), 2000);
  }, [userWord, updateState]);

  // Mouse tracking for weight response
  useEffect(() => {
    if (!isRevealed || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isRevealed]);

  // Update letter weights based on mouse proximity
  useEffect(() => {
    if (!isRevealed || prefersReducedMotion) return;

    setLetters(prev => prev.map((letter, i) => {
      const letterX = (i + 0.5) / prev.length;
      const letterY = 0.5;

      const dx = mousePos.x - letterX;
      const dy = mousePos.y - letterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Weight increases with proximity
      const proximity = Math.max(0, 1 - distance * 2);
      const targetWeight = 300 + proximity * 500;

      // Smooth interpolation
      const newWeight = letter.weight + (targetWeight - letter.weight) * 0.1;

      // Slight vertical offset based on weight
      const offsetY = (newWeight - 400) / 50;

      return {
        ...letter,
        weight: newWeight,
        offsetY,
      };
    }));
  }, [mousePos, isRevealed, prefersReducedMotion]);

  // Breathing animation
  useEffect(() => {
    if (!isRevealed || prefersReducedMotion) return;

    let frame: number;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;
      setBreathePhase(Math.sin(elapsed * 0.8));

      // Update letter spacing for breathing effect
      setLetters(prev => prev.map((letter, i) => ({
        ...letter,
        spacing: Math.sin(elapsed * 0.8 + i * 0.2) * 3,
      })));

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isRevealed, prefersReducedMotion]);

  // Performance playback
  const startPerformance = useCallback(() => {
    if (isPerforming) return;

    setIsPerforming(true);
    setPerformanceProgress(0);

    const duration = 10000; // 10 seconds
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      setPerformanceProgress(progress);

      // Choreographed animation phases
      setLetters(prev => prev.map((letter, i) => {
        const phase = (progress * 4 + i * 0.2) % 1;
        const wavePhase = Math.sin(progress * Math.PI * 4 + i * 0.5);

        // Phase 0-0.25: Scale wave
        // Phase 0.25-0.5: Weight wave
        // Phase 0.5-0.75: Rotation wave
        // Phase 0.75-1: Return to rest

        let weight = letter.baseWeight;
        let rotation = 0;

        if (progress < 0.25) {
          weight = 400 + wavePhase * 300;
        } else if (progress < 0.5) {
          weight = 300 + Math.sin(progress * Math.PI * 6 + i * 0.3) * 400;
        } else if (progress < 0.75) {
          rotation = wavePhase * 15;
          weight = 500 + wavePhase * 200;
        } else {
          const settle = (progress - 0.75) / 0.25;
          weight = letter.weight + (letter.baseWeight - letter.weight) * settle;
          rotation = letter.rotation * (1 - settle);
        }

        return {
          ...letter,
          weight,
          rotation,
        };
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPerforming(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isPerforming]);

  // Cleanup animation
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle letter drag for spacing
  const handleLetterDrag = useCallback((index: number, deltaX: number) => {
    setLetters(prev => prev.map((letter, i) =>
      i === index ? { ...letter, x: letter.x + deltaX * 0.01 } : letter
    ));
  }, []);

  if (prefersReducedMotion) {
    return (
      <div
        className="relative h-screen w-full flex flex-col items-center justify-center"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {!isRevealed ? (
          <div className="text-center">
            <p className="text-[#1A1A1A]/60 text-lg mb-6">Now, create.</p>
            <input
              ref={inputRef}
              type="text"
              value={userWord}
              onChange={(e) => setUserWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your word..."
              className="bg-transparent border-b-2 border-[#1A1A1A]/30 text-[#1A1A1A] text-2xl text-center py-4 px-8 focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        ) : (
          <div
            className="text-[min(16vw,180px)]"
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 500,
              color: palette.primary,
            }}
          >
            {userWord.toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: isRevealed ? palette.bg : '#FFFFFF' }}
    >
      {/* Genesis particles (callback to Age 1) */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: palette.primary,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Input phase */}
      {!isRevealed && (
        <div className="text-center z-10">
          <p className="text-[#1A1A1A]/60 text-xl mb-8">Now, create.</p>
          <input
            ref={inputRef}
            type="text"
            value={userWord}
            onChange={(e) => setUserWord(e.target.value.slice(0, 12))}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Your word..."
            className="bg-transparent border-b-2 border-[#1A1A1A]/20 text-[#1A1A1A] text-3xl text-center py-4 px-8 focus:outline-none focus:border-[#1A1A1A] transition-all"
            autoFocus
            maxLength={12}
          />
          <p className="text-[#1A1A1A]/40 text-xs mt-4">
            Press Enter to bring it to life
          </p>
        </div>
      )}

      {/* The Living Word */}
      {isRevealed && (
        <>
          {/* Negative space glow (callback to Age 5) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${palette.primary}08 0%, transparent 50%)`,
              transform: `scale(${1 + breathePhase * 0.1})`,
              transition: 'transform 0.3s ease-out',
            }}
          />

          {/* Letters */}
          <div className="relative flex items-center justify-center">
            {letters.map((letter, i) => (
              <div
                key={i}
                className="relative cursor-pointer transition-all duration-150"
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'min(14vw, 160px)',
                  fontVariationSettings: `"wght" ${letter.weight}, "opsz" 72`,
                  color: `hsl(${letter.hue}, 60%, 45%)`,
                  transform: `translateY(${letter.offsetY}px) translateX(${letter.spacing}px) rotate(${letter.rotation}deg)`,
                  marginRight: `${letter.spacing * 0.5}px`,
                  textShadow: `0 ${letter.weight / 100}px ${letter.weight / 50}px rgba(0,0,0,0.1)`,
                }}
                title={`Weight: ${Math.round(letter.weight)}`}
              >
                {letter.char}
              </div>
            ))}
          </div>

          {/* Performance timeline */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64">
            <div
              className="h-1 bg-[#1A1A1A]/10 rounded-full overflow-hidden cursor-pointer"
              onClick={startPerformance}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${performanceProgress * 100}%`,
                  backgroundColor: palette.primary,
                }}
              />
            </div>
            <button
              onClick={startPerformance}
              disabled={isPerforming}
              className="mt-4 w-full text-center text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {isPerforming ? 'Playing...' : 'Play Performance'}
            </button>
          </div>

          {/* Actions */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6">
            <button
              onClick={() => goToAge('primordial')}
              className="px-6 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all text-sm"
            >
              Again
            </button>
            <button
              onClick={() => {
                setIsRevealed(false);
                setUserWord('');
                setLetters([]);
              }}
              className="px-6 py-2 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all text-sm"
            >
              New Word
            </button>
          </div>

          {/* Instructions */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
            <p className="text-[#1A1A1A]/50 text-sm">
              Move your cursor to feel the weight. Each letter responds to your presence.
            </p>
          </div>
        </>
      )}

      {/* Completion message (first time) */}
      {isRevealed && !state.creation.isPerforming && performanceProgress === 0 && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#1A1A1A]/70 text-lg">
            You are now the typographer.
          </p>
          <p className="text-[#1A1A1A]/50 text-sm mt-2">
            Every choice—weight, space, voice—is yours.
          </p>
        </div>
      )}
    </div>
  );
};
