import React from 'react';
import type { AgeId } from '../TypographyLabPage';

interface AgeTransitionProps {
  isActive: boolean;
  fromAge: AgeId;
  toAge: AgeId;
}

export const AgeTransition: React.FC<AgeTransitionProps> = ({
  isActive,
  fromAge,
  toAge,
}) => {
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      aria-hidden="true"
    >
      {/* Radial wipe effect */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at center, var(--v3-bg) 0%, transparent 70%)`,
          transform: isActive ? 'scale(3)' : 'scale(0)',
        }}
      />

      {/* Center flash */}
      <div
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-4 h-4 rounded-full bg-[var(--v3-accent)]
          transition-all duration-500
          ${isActive ? 'scale-[60] opacity-0' : 'scale-0 opacity-100'}
        `}
        style={{
          transitionDelay: isActive ? '200ms' : '0ms',
        }}
      />
    </div>
  );
};
