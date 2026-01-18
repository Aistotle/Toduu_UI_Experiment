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
        <section className="py-24 bg-white border-t-4 border-red-500">
          <div className="max-w-4xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-red-500 font-mono text-sm uppercase tracking-wider">Version 2.0</span>
                <h2 className="text-5xl font-black text-neutral-900 mt-2 mb-4 leading-tight">
                  Brutally<br />Simple.
                </h2>
                <p className="text-neutral-500 text-lg">
                  No features you don't need. No complexity you didn't ask for.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button className="w-full py-4 bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition-colors">
                  Download Free
                </button>
                <button className="w-full py-4 border-2 border-neutral-900 text-neutral-900 font-bold text-lg hover:bg-neutral-900 hover:text-white transition-colors">
                  View Source
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
