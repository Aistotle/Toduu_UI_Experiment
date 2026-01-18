import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AgeState } from '../TypographyLabPage';

interface AgeSilenceProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
}

interface ClutterElement {
  id: string;
  type: 'button' | 'text' | 'border' | 'icon' | 'gradient' | 'shadow' | 'badge';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  isVisible: boolean;
  zIndex: number;
}

// Generate clutter elements
const generateClutter = (): ClutterElement[] => {
  const clutter: ClutterElement[] = [
    // Buttons
    { id: 'btn1', type: 'button', content: 'Click Here!', x: 15, y: 20, width: 120, height: 40, rotation: -5, color: '#FF5722', isVisible: true, zIndex: 10 },
    { id: 'btn2', type: 'button', content: 'Subscribe', x: 75, y: 15, width: 100, height: 35, rotation: 3, color: '#4CAF50', isVisible: true, zIndex: 11 },
    { id: 'btn3', type: 'button', content: 'Learn More', x: 70, y: 75, width: 110, height: 38, rotation: -2, color: '#2196F3', isVisible: true, zIndex: 12 },

    // Lorem text blocks
    { id: 'text1', type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...', x: 5, y: 60, width: 200, height: 60, rotation: 2, color: '#666', isVisible: true, zIndex: 5 },
    { id: 'text2', type: 'text', content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', x: 65, y: 40, width: 180, height: 50, rotation: -3, color: '#888', isVisible: true, zIndex: 6 },

    // Decorative borders
    { id: 'border1', type: 'border', content: '', x: 10, y: 10, width: 80, height: 80, rotation: 0, color: '#E91E63', isVisible: true, zIndex: 3 },
    { id: 'border2', type: 'border', content: '', x: 50, y: 25, width: 45, height: 50, rotation: 45, color: '#9C27B0', isVisible: true, zIndex: 4 },

    // Icons
    { id: 'icon1', type: 'icon', content: '★', x: 85, y: 30, width: 40, height: 40, rotation: 15, color: '#FFC107', isVisible: true, zIndex: 15 },
    { id: 'icon2', type: 'icon', content: '♦', x: 20, y: 70, width: 35, height: 35, rotation: -10, color: '#FF5722', isVisible: true, zIndex: 16 },
    { id: 'icon3', type: 'icon', content: '●', x: 40, y: 15, width: 30, height: 30, rotation: 0, color: '#3F51B5', isVisible: true, zIndex: 14 },

    // Gradient blobs
    { id: 'grad1', type: 'gradient', content: '', x: 0, y: 0, width: 100, height: 100, rotation: 0, color: 'linear-gradient(135deg, #ff9a9e22 0%, #fecfef22 100%)', isVisible: true, zIndex: 1 },

    // Shadows
    { id: 'shadow1', type: 'shadow', content: '', x: 30, y: 40, width: 40, height: 20, rotation: 0, color: 'rgba(0,0,0,0.3)', isVisible: true, zIndex: 2 },
  ];

  return clutter;
};

export const AgeSilence: React.FC<AgeSilenceProps> = ({
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
  const [clutter, setClutter] = useState<ClutterElement[]>(() => generateClutter());
  const [removedCount, setRemovedCount] = useState(0);
  const [phase, setPhase] = useState<'removing' | 'breathing' | 'reveal' | 'complete'>('removing');
  const [breatheScale, setBreatheScale] = useState(1);
  const [showNegativeSpace, setShowNegativeSpace] = useState(false);

  const totalClutter = clutter.length;
  const remainingClutter = clutter.filter(c => c.isVisible).length;

  // Calculate background lightness based on removed elements
  const bgLightness = 88 + (removedCount / totalClutter) * 12; // 88% to 100%

  // Word visibility based on removed clutter
  const wordOpacity = 0.3 + (removedCount / totalClutter) * 0.7;

  // Handle clutter removal
  const removeElement = useCallback((id: string) => {
    if (phase !== 'removing') return;

    setClutter(prev =>
      prev.map(el =>
        el.id === id ? { ...el, isVisible: false } : el
      )
    );
    setRemovedCount(prev => prev + 1);
  }, [phase]);

  // Check for phase transitions
  useEffect(() => {
    if (remainingClutter === 0 && phase === 'removing') {
      setPhase('breathing');

      // Start breathing phase
      setTimeout(() => {
        setPhase('reveal');
        setShowNegativeSpace(true);

        // Complete after reveal
        setTimeout(() => {
          setPhase('complete');
          updateStateRef.current('silence', { negativeSpaceRevealed: true, remainingClutter: 0 });
          setTimeout(() => onCompleteRef.current(), 2000);
        }, 2500);
      }, 1500);
    }
  }, [remainingClutter, phase]);

  // Breathing animation
  useEffect(() => {
    if (phase !== 'breathing' && phase !== 'reveal' && phase !== 'complete') return;
    if (prefersReducedMotion) return;

    let frame: number;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;
      setBreatheScale(1 + Math.sin(elapsed * 1.2) * 0.02);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phase, prefersReducedMotion]);

  // Render a clutter element
  const renderClutterElement = (el: ClutterElement) => {
    if (!el.isVisible) return null;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${el.x}%`,
      top: `${el.y}%`,
      transform: `rotate(${el.rotation}deg)`,
      cursor: 'pointer',
      transition: 'all 0.3s ease-out',
      zIndex: el.zIndex,
    };

    const handleClick = () => removeElement(el.id);

    switch (el.type) {
      case 'button':
        return (
          <button
            key={el.id}
            onClick={handleClick}
            className="hover:scale-105 hover:shadow-lg transition-all px-4 py-2 rounded-lg text-white text-sm font-bold"
            style={{
              ...baseStyle,
              backgroundColor: el.color,
              width: el.width,
            }}
          >
            {el.content}
          </button>
        );

      case 'text':
        return (
          <div
            key={el.id}
            onClick={handleClick}
            className="hover:opacity-70 transition-opacity text-xs leading-relaxed p-2"
            style={{
              ...baseStyle,
              color: el.color,
              width: el.width,
              maxHeight: el.height,
              overflow: 'hidden',
            }}
          >
            {el.content}
          </div>
        );

      case 'border':
        return (
          <div
            key={el.id}
            onClick={handleClick}
            className="hover:border-opacity-50 transition-all"
            style={{
              ...baseStyle,
              width: el.width,
              height: el.height,
              border: `3px dashed ${el.color}`,
              borderRadius: '8px',
            }}
          />
        );

      case 'icon':
        return (
          <div
            key={el.id}
            onClick={handleClick}
            className="hover:scale-125 transition-transform flex items-center justify-center"
            style={{
              ...baseStyle,
              width: el.width,
              height: el.height,
              fontSize: el.width * 0.8,
              color: el.color,
            }}
          >
            {el.content}
          </div>
        );

      case 'gradient':
        return (
          <div
            key={el.id}
            onClick={handleClick}
            className="hover:opacity-50 transition-opacity pointer-events-auto"
            style={{
              ...baseStyle,
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              background: el.color,
            }}
          />
        );

      case 'shadow':
        return (
          <div
            key={el.id}
            onClick={handleClick}
            className="hover:opacity-30 transition-opacity rounded-full blur-xl"
            style={{
              ...baseStyle,
              width: el.width * 2,
              height: el.height * 2,
              backgroundColor: el.color,
            }}
          />
        );

      default:
        return null;
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-white">
        <div
          className="text-[12vw] cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            color: '#000000',
          }}
          onClick={onComplete}
        >
          SILENCE
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
      className="relative h-screen w-full overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: `hsl(0, 0%, ${bgLightness}%)` }}
    >
      {/* Clutter elements */}
      <div className="absolute inset-0">
        {clutter.map(el => renderClutterElement(el))}
      </div>

      {/* The Word */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div className="relative">
          {/* Negative space visualization */}
          {showNegativeSpace && (
            <div className="absolute inset-0 -m-12">
              {/* Counter-space glow around letters */}
              <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.02) 0%, transparent 70%)',
                  opacity: showNegativeSpace ? 1 : 0,
                  animation: 'pulse 3s infinite',
                }}
              />
            </div>
          )}

          <div
            className="text-[min(12vw,140px)] transition-all duration-700"
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 500,
              color: `rgba(0, 0, 0, ${wordOpacity})`,
              transform: `scale(${breatheScale})`,
            }}
          >
            {state.voice.currentWord || 'SILENCE'}
          </div>

          {/* Counter-space indicators */}
          {showNegativeSpace && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'scale(1.5)', opacity: 0.15 }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Animated circles representing negative space */}
              <circle cx="30%" cy="50%" r="20" fill="none" stroke="#000" strokeWidth="0.5" filter="url(#glow)" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="70%" cy="50%" r="15" fill="none" stroke="#000" strokeWidth="0.5" filter="url(#glow)" className="animate-ping" style={{ animationDuration: '4s' }} />
            </svg>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {phase === 'removing' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="flex gap-1 mb-2 justify-center">
            {Array.from({ length: totalClutter }).map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${i < removedCount ? 'bg-transparent border border-black/20' : 'bg-black/20'}
                `}
              />
            ))}
          </div>
          <p className="text-[#1A1A1A]/50 text-sm">
            Click to remove the noise
          </p>
        </div>
      )}

      {/* Phase messages */}
      {phase === 'breathing' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#1A1A1A]/70 text-lg animate-pulse">
            The word breathes...
          </p>
        </div>
      )}

      {phase === 'reveal' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#1A1A1A]/80 text-lg">
            See the space that holds the letters.
          </p>
        </div>
      )}

      {phase === 'complete' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#1A1A1A]/80 text-lg">
            Silence has weight.
          </p>
          <p className="text-[#1A1A1A]/50 text-sm mt-2">
            What isn't there often speaks the loudest.
          </p>
        </div>
      )}

      {/* Pulse animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};
