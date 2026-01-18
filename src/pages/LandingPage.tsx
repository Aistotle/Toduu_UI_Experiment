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
        <section className="py-32 bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-white mb-6 font-display drop-shadow-lg">
              Built for Momentum
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Every task completed builds on the last. Watch your progress compound.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg">
                Start Building
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
                See How It Works
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
