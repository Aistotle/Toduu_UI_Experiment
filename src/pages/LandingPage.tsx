import { useRef, useCallback } from 'react';
import { Bowl } from '../components/landing/Bowl';
import { Hero } from '../components/landing/Hero';
import { Philosophy } from '../components/landing/Philosophy';
import { ChapterScale } from '../components/landing/ChapterScale';
import { ChapterWeight } from '../components/landing/ChapterWeight';
import { SilenceSection } from '../components/landing/SilenceSection';
import { HierarchySection } from '../components/landing/HierarchySection';
import { AsciiSection } from '../components/ascii/AsciiSection';

export function LandingPage() {
  const grainRef = useRef<HTMLDivElement>(null);

  const handleGrainOpacity = useCallback((opacity: number) => {
    if (grainRef.current) {
      grainRef.current.style.opacity = String(opacity);
    }
  }, []);

  return (
    <>
      {/* Grain texture overlay for warm paper feel */}
      <div ref={grainRef} className="grain" aria-hidden="true" />

      <main className="min-h-screen bg-bg">
        <Bowl />
        <Hero />

        {/* Divider */}
        <div className="w-full h-px bg-ink/10 mx-auto max-w-[90%]" />

        <ChapterScale />

        {/* Divider */}
        <div className="w-full h-px bg-ink/10 mx-auto max-w-[90%]" />

        <ChapterWeight />

        <SilenceSection />

        <Philosophy />

        <HierarchySection onGrainOpacity={handleGrainOpacity} />

        <AsciiSection />

        {/* Experimental footer section */}
        <section className="py-40 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-6xl font-bold text-white mb-8 font-display drop-shadow-lg">
              Flow State Awaits
            </h2>
            <p className="text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Clear your mind. One task at a time. Find your rhythm.
            </p>
            <div className="flex gap-6 justify-center">
              <button className="px-10 py-5 bg-white text-teal-600 font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-lg">
                Enter Flow
              </button>
              <button className="px-10 py-5 border-2 border-white text-white font-bold rounded-full hover:bg-white/20 transition-colors text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
