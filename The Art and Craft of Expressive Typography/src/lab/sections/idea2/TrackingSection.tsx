import React from 'react';
import { ScrollStep } from '../../components/ScrollStep';
import { TrackingDemo } from '../../components/TrackingDemo';

export const Idea02TrackingSection: React.FC = () => {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white/90 p-8 md:p-12">
      <ScrollStep forceVisible>
        {({ visible }) => (
          <div className="text-center">
            <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/50">Idea 02 · 04 / Spacing</p>
            <h3 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
              Tracking modulates <span className="text-black/50">texture</span>
            </h3>
            <p
              className={`mx-auto mt-4 max-w-2xl text-base md:text-lg text-black/70 transition-opacity duration-700 ${
                visible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              This section mirrors the slider from <code className="mx-1 text-sm">new-ideas-2.html</code> where the range input controls letters adjacent to it rather than the slider label itself.
            </p>
          </div>
        )}
      </ScrollStep>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
        <ScrollStep forceVisible>
          {() => (
            <div className="text-left">
              <p className="text-sm uppercase tracking-[0.4em] text-black/50">Why it matters</p>
              <h4 className="mt-4 text-3xl font-semibold text-black">Spacing equals mood.</h4>
              <p className="mt-4 text-base text-black/70">
                Tight tracking feels urgent and dense. Open tracking feels calm and airy. Designers treat these values as knobs to set emotional tone before readers digest actual language.
              </p>
            </div>
          )}
        </ScrollStep>
        <TrackingDemo description="Drag to feel urgency vs calm." />
      </div>
    </section>
  );
};

export default Idea02TrackingSection;
