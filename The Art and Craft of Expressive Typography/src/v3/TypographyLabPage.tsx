import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Age Components (will be created)
import { AgePrimordial } from './components/AgePrimordial';
import { AgeGravity } from './components/AgeGravity';
import { AgeTension } from './components/AgeTension';
import { AgeVoice } from './components/AgeVoice';
import { AgeSilence } from './components/AgeSilence';
import { AgeCreation } from './components/AgeCreation';
import { AgeTransition } from './components/AgeTransition';
import { ProgressIndicator } from './components/ProgressIndicator';

// Types
export type AgeId = 'primordial' | 'gravity' | 'tension' | 'voice' | 'silence' | 'creation';

export interface AgeState {
  primordial: {
    letterOpacity: number;
    isCrystallized: boolean;
    movementAccumulated: number;
  };
  gravity: {
    letterWeight: number;
    wellPositions: Array<{ x: number; y: number; id: string }>;
    isStabilized: boolean;
  };
  tension: {
    letterPositions: Record<string, number>;
    isHarmonious: boolean;
  };
  voice: {
    userInput: string;
    detectedVoice: 'formal' | 'modern' | 'playful' | 'technical' | null;
    currentWord: string;
  };
  silence: {
    remainingClutter: number;
    negativeSpaceRevealed: boolean;
  };
  creation: {
    userWord: string;
    isPerforming: boolean;
    timelinePosition: number;
  };
}

export interface V3GlobalState {
  currentAge: AgeId;
  completedAges: Set<AgeId>;
  ageState: AgeState;
  isTransitioning: boolean;
}

const AGE_ORDER: AgeId[] = ['primordial', 'gravity', 'tension', 'voice', 'silence', 'creation'];

const AGE_THEMES: Record<AgeId, { bg: string; accent: string; text: string }> = {
  primordial: { bg: '#0A0A0B', accent: '#FFD700', text: '#F0E6D3' },
  gravity: { bg: '#FAFAFA', accent: '#43A047', text: '#1A1A1A' },
  tension: { bg: '#FFF8F0', accent: '#4CAF50', text: '#2D2D2D' },
  voice: { bg: '#1A1A2E', accent: '#FFD700', text: '#F0F0F0' },
  silence: { bg: '#E8E8E8', accent: '#000000', text: '#1A1A1A' },
  creation: { bg: '#FFFFFF', accent: '#FF6B6B', text: '#1A1A1A' },
};

const initialAgeState: AgeState = {
  primordial: {
    letterOpacity: 0,
    isCrystallized: false,
    movementAccumulated: 0,
  },
  gravity: {
    letterWeight: 300,
    wellPositions: [
      { x: 0.2, y: 0.3, id: 'well-1' },
      { x: 0.8, y: 0.7, id: 'well-2' },
      { x: 0.5, y: 0.2, id: 'well-3' },
    ],
    isStabilized: false,
  },
  tension: {
    letterPositions: {},
    isHarmonious: false,
  },
  voice: {
    userInput: '',
    detectedVoice: null,
    currentWord: 'BREATHE',
  },
  silence: {
    remainingClutter: 12,
    negativeSpaceRevealed: false,
  },
  creation: {
    userWord: '',
    isPerforming: false,
    timelinePosition: 0,
  },
};

export const TypographyLabPage: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [state, setState] = useState<V3GlobalState>({
    currentAge: 'primordial',
    completedAges: new Set(),
    ageState: initialAgeState,
    isTransitioning: false,
  });

  const currentTheme = AGE_THEMES[state.currentAge];
  const currentAgeIndex = AGE_ORDER.indexOf(state.currentAge);

  // Update age-specific state
  const updateAgeState = useCallback(<K extends keyof AgeState>(
    age: K,
    updates: Partial<AgeState[K]>
  ) => {
    setState(prev => ({
      ...prev,
      ageState: {
        ...prev.ageState,
        [age]: { ...prev.ageState[age], ...updates },
      },
    }));
  }, []);

  // Mark current age as complete and advance
  const completeAge = useCallback((ageId: AgeId) => {
    const nextIndex = AGE_ORDER.indexOf(ageId) + 1;
    if (nextIndex >= AGE_ORDER.length) return;

    const nextAge = AGE_ORDER[nextIndex];

    setState(prev => ({
      ...prev,
      isTransitioning: true,
      completedAges: new Set([...prev.completedAges, ageId]),
    }));

    // After transition animation
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentAge: nextAge,
        isTransitioning: false,
      }));
    }, prefersReducedMotion ? 100 : 1200);
  }, [prefersReducedMotion]);

  // Go to specific age (for navigation/restart)
  const goToAge = useCallback((ageId: AgeId) => {
    setState(prev => ({
      ...prev,
      isTransitioning: true,
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentAge: ageId,
        isTransitioning: false,
        ageState: ageId === 'primordial' ? initialAgeState : prev.ageState,
      }));
    }, prefersReducedMotion ? 100 : 800);
  }, [prefersReducedMotion]);

  // Apply theme as CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--v3-bg', currentTheme.bg);
    root.style.setProperty('--v3-accent', currentTheme.accent);
    root.style.setProperty('--v3-text', currentTheme.text);

    return () => {
      root.style.removeProperty('--v3-bg');
      root.style.removeProperty('--v3-accent');
      root.style.removeProperty('--v3-text');
    };
  }, [currentTheme]);

  // Memoize onComplete to prevent infinite loops in child components
  const handleAgeComplete = useCallback(() => {
    completeAge(state.currentAge);
  }, [completeAge, state.currentAge]);

  // Memoize common props to prevent unnecessary re-renders
  const commonProps = useMemo(() => ({
    state: state.ageState,
    updateState: updateAgeState,
    onComplete: handleAgeComplete,
    prefersReducedMotion,
  }), [state.ageState, updateAgeState, handleAgeComplete, prefersReducedMotion]);

  // Render current age
  const renderAge = () => {
    switch (state.currentAge) {
      case 'primordial':
        return <AgePrimordial {...commonProps} />;
      case 'gravity':
        return <AgeGravity {...commonProps} />;
      case 'tension':
        return <AgeTension {...commonProps} />;
      case 'voice':
        return <AgeVoice {...commonProps} />;
      case 'silence':
        return <AgeSilence {...commonProps} />;
      case 'creation':
        return <AgeCreation {...commonProps} goToAge={goToAge} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
    >
      {/* Progress Indicator */}
      <ProgressIndicator
        ages={AGE_ORDER}
        currentAge={state.currentAge}
        completedAges={state.completedAges}
        onAgeClick={goToAge}
      />

      {/* Age Transition Overlay */}
      <AgeTransition
        isActive={state.isTransitioning}
        fromAge={state.currentAge}
        toAge={AGE_ORDER[currentAgeIndex + 1] || state.currentAge}
      />

      {/* Current Age Content */}
      <main className="relative z-10 min-h-screen w-full">
        {renderAge()}
      </main>
    </div>
  );
};

export default TypographyLabPage;
