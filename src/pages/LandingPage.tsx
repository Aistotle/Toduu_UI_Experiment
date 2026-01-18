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
        <section className="py-36 bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 mb-6 font-display">
              Simplicity is Power
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              No noise. No clutter. Just you and what matters next.
            </p>
            <div className="flex gap-5 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30">
                Try It Free
              </button>
              <button className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-purple-500 hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
