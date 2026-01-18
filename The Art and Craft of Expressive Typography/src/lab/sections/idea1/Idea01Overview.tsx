import React from 'react';

const sections = [
  {
    title: 'Scale',
    description: 'Hierarchy built with simple size ladders.',
  },
  {
    title: 'Weight',
    description: 'Whisper vs shout via font-weight changes.',
  },
  {
    title: 'Rhythm',
    description: 'Line-height adjustments control pacing.',
  },
  {
    title: 'Spacing',
    description: 'Letter spacing toggles tension.',
  },
  {
    title: 'Voice',
    description: 'Typeface swaps change persona instantly.',
  },
  {
    title: 'Silence',
    description: 'Negative space carries meaning on its own.',
  },
];

export const Idea01Overview: React.FC = () => {
  return (
    <section className="rounded-[32px] border border-black/10 bg-gradient-to-br from-slate-50 to-white p-10">
      <div className="text-center space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/50">Idea 01 · Immersive Scroll Narrative</p>
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black">The Art &amp; Craft</h2>
        <p className="text-lg text-black/70 max-w-3xl mx-auto">
          This idea lives as a GSAP narrative with click/hover experiments. While we build the React version, here’s a snapshot of the six sections we’ll be porting.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-black/10 bg-white/80 p-6 text-left">
            <h3 className="text-2xl font-semibold text-black">{section.title}</h3>
            <p className="mt-2 text-black/70">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Idea01Overview;
