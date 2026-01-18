import React from 'react';
import { SectionIntro } from '../../components/SectionIntro';

export const Idea03SilencePanel: React.FC = () => {
  return (
    <section className="rounded-[32px] bg-black text-white px-8 py-20">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionIntro
            eyebrow="Idea 03 · 05"
            title="Silence defines form"
            description="Negative space vignette that mirrors the grid from new-ideas-3; meant to be lifted as-is into quiet chapters."
            variant="dark"
          />
        </div>
        <div className="md:col-span-8 flex items-center justify-center">
          <div className="text-center space-y-6">
            <p className="text-xs font-mono tracking-[0.8em] text-white/40 uppercase">Silence</p>
            <p className="text-2xl md:text-4xl font-serif italic">“The space defines the form.”</p>
            <div className="mt-10 h-[1px] w-32 bg-white/30 mx-auto" />
            <p className="text-sm text-white/60">Leave room. Let the message exhale.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Idea03SilencePanel;
