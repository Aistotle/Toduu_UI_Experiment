import React from 'react';

const voices = [
  { id: 'serif', text: 'Elegant and sophisticated', className: 'font-playfair' },
  { id: 'sans', text: 'Clean and modern', className: 'font-sans' },
  { id: 'mono', text: 'Technical and precise', className: 'font-jetbrains' },
  {
    id: 'space',
    text: 'Geometric and bold',
    style: { fontFamily: '"Space Grotesk", "Inter", sans-serif' },
  },
];

export const Idea01VoicePersonas: React.FC = () => {
  return (
    <section className="rounded-[32px] border border-black/10 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 px-8 py-16 text-center">
      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/40">Voice Personas</p>
        <h3 className="text-4xl md:text-5xl font-playfair font-semibold text-black">Voice</h3>
        <p className="text-base md:text-lg text-black/70 max-w-2xl mx-auto">
          Each typeface has personality. Hover or focus each sentence to feel the tonal shift.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {voices.map((voice) => (
          <p
            key={voice.id}
            tabIndex={0}
            className={`text-3xl md:text-4xl text-black transition-transform duration-300 ease-out cursor-pointer hover:scale-[1.05] focus-visible:scale-[1.05] focus-visible:outline-none ${voice.className ?? ''}`.trim()}
            style={voice.style}
          >
            {voice.text}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Idea01VoicePersonas;
