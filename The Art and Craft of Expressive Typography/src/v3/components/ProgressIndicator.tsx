import React from 'react';
import type { AgeId } from '../TypographyLabPage';

interface ProgressIndicatorProps {
  ages: AgeId[];
  currentAge: AgeId;
  completedAges: Set<AgeId>;
  onAgeClick: (age: AgeId) => void;
}

const AGE_LABELS: Record<AgeId, string> = {
  primordial: 'I',
  gravity: 'II',
  tension: 'III',
  voice: 'IV',
  silence: 'V',
  creation: 'VI',
};

const AGE_NAMES: Record<AgeId, string> = {
  primordial: 'Primordial',
  gravity: 'Gravity',
  tension: 'Tension',
  voice: 'Voice',
  silence: 'Silence',
  creation: 'Creation',
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  ages,
  currentAge,
  completedAges,
  onAgeClick,
}) => {
  const currentIndex = ages.indexOf(currentAge);

  return (
    <nav
      className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
      aria-label="Journey progress"
    >
      <ol className="flex items-center gap-1">
        {ages.map((age, index) => {
          const isCompleted = completedAges.has(age);
          const isCurrent = age === currentAge;
          const isAccessible = isCompleted || isCurrent || index <= currentIndex;

          return (
            <li key={age} className="relative">
              <button
                onClick={() => isAccessible && onAgeClick(age)}
                disabled={!isAccessible}
                className={`
                  group relative flex items-center justify-center
                  w-8 h-8 rounded-full text-xs font-medium
                  transition-all duration-500 ease-out
                  ${isCurrent
                    ? 'bg-[var(--v3-accent)] text-[var(--v3-bg)] scale-110 shadow-lg'
                    : isCompleted
                      ? 'bg-[var(--v3-text)]/20 text-[var(--v3-text)] hover:bg-[var(--v3-text)]/30'
                      : 'bg-[var(--v3-text)]/5 text-[var(--v3-text)]/30 cursor-not-allowed'
                  }
                `}
                aria-label={`${AGE_NAMES[age]}${isCurrent ? ' (current)' : isCompleted ? ' (completed)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="relative z-10">{AGE_LABELS[age]}</span>

                {/* Pulse ring for current */}
                {isCurrent && (
                  <span
                    className="absolute inset-0 rounded-full bg-[var(--v3-accent)] animate-ping opacity-20"
                    aria-hidden
                  />
                )}

                {/* Tooltip on hover */}
                <span
                  className={`
                    absolute -bottom-8 left-1/2 -translate-x-1/2
                    px-2 py-1 rounded text-[10px] font-medium tracking-wide uppercase
                    bg-[var(--v3-text)] text-[var(--v3-bg)]
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    whitespace-nowrap pointer-events-none
                  `}
                  aria-hidden
                >
                  {AGE_NAMES[age]}
                </span>
              </button>

              {/* Connector line */}
              {index < ages.length - 1 && (
                <div
                  className={`
                    absolute top-1/2 left-full w-1 h-0.5 -translate-y-1/2
                    transition-colors duration-500
                    ${index < currentIndex
                      ? 'bg-[var(--v3-text)]/30'
                      : 'bg-[var(--v3-text)]/10'
                    }
                  `}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
