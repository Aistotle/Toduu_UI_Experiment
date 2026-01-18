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
        <section className="py-32 bg-stone-100">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-light text-stone-800 mb-4 font-display tracking-tight">
              Less, but better.
            </h2>
            <p className="text-lg text-stone-500 mb-8 leading-relaxed">
              Inspired by the calm of finishing. Built for people who do.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-stone-900 text-stone-100 font-medium rounded hover:bg-stone-800 transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 text-stone-600 font-medium hover:text-stone-900 transition-colors">
                About Us
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
