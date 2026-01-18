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
        <section className="py-28 bg-sky-50 border-t border-sky-100">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-semibold text-sky-900 mb-3 font-display">
              One thing at a time
            </h2>
            <p className="text-base text-sky-700/70 mb-8 max-w-md mx-auto">
              Focus is a superpower. We help you wield it.
            </p>
            <button className="px-8 py-3 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors shadow-md shadow-sky-200">
              Start Focusing
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
