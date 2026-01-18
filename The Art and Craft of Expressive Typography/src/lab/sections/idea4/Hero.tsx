import React from 'react';

export const Idea04Hero: React.FC = () => {
  return (
    <section className="rounded-[32px] border border-black/10 bg-gradient-to-br from-slate-50 to-white px-6 py-20 text-center">
      <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/50">Idea 04 · Interaction Deck</p>
      <h2 className="mt-6 text-5xl md:text-7xl font-light leading-tight">
        The Art &amp; Craft of <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Expressive Typography</span>
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg text-black/70">
        This hero mirrors the React + GSAP file that paired alternating text blocks with sliders. Here, every demo is modular so we can drop the section into the main page without re-binding DOM scripts.
      </p>
    </section>
  );
};

export default Idea04Hero;
