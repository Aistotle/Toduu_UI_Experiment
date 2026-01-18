import React from 'react';

const states = [
  { label: 'TIGHTLY BOUND', tracking: -0.1 },
  { label: 'NORMAL FLOW', tracking: 0 },
  { label: 'S P A C I O U S', tracking: 0.1 },
  { label: 'E X P A N S I V E', tracking: 0.3 },
];

export const Idea01SpacingStates: React.FC = () => {
  return (
    <div className="rounded-[32px] border border-black/10 bg-gradient-to-b from-white to-slate-50 px-8 py-16 text-center">
      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/40">Spacing states</p>
        <h3 className="text-4xl md:text-5xl font-playfair font-semibold text-black">Spacing</h3>
        <p className="text-base md:text-lg text-black/70 max-w-2xl mx-auto">
          The dance between letters—from tight to expansive—changes emotional charge, density, and rhythm.
        </p>
      </div>

      <div className="mt-12 space-y-10 text-center">
        {states.map((state) => (
          <p
            key={state.label}
            className="text-3xl md:text-5xl font-bold text-black transition-transform duration-300 ease-out cursor-pointer hover:scale-[1.05]"
            style={{
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
              letterSpacing: `${state.tracking}em`,
            }}
          >
            {state.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Idea01SpacingStates;
