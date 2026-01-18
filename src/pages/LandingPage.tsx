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
        <section className="py-24 bg-black text-white">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-2">
                <h2 className="text-4xl font-bold mb-4 font-display">
                  Ready to ship?
                </h2>
                <p className="text-lg text-white/60">
                  Stop planning. Start doing. Your future self will thank you.
                </p>
              </div>
              <div className="flex md:justify-end">
                <button className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors">
                  Let's Go →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
