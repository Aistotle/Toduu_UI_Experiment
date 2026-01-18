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
        <section className="py-20 bg-gradient-to-r from-rose-100 via-pink-50 to-amber-100">
          <div className="max-w-2xl mx-auto px-8 text-center">
            <p className="text-sm uppercase tracking-widest text-rose-400 mb-3">The end is just the beginning</p>
            <h2 className="text-3xl font-serif italic text-stone-700 mb-6">
              "Productivity is never an accident. It is always the result of commitment to excellence."
            </h2>
            <div className="w-16 h-px bg-rose-300 mx-auto mb-6" />
            <button className="px-6 py-3 border-2 border-stone-400 text-stone-600 font-medium rounded-full hover:border-rose-400 hover:text-rose-500 transition-colors">
              Begin Your Journey
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
