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
        <section className="py-32 bg-indigo-950 overflow-hidden relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 font-display">
              Your tasks deserve better
            </h2>
            <p className="text-indigo-300 mb-8 text-lg">
              Join thousands who've reclaimed their focus.
            </p>
            <div className="flex gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-indigo-400 w-64 focus:outline-none focus:border-indigo-400"
              />
              <button className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400 transition-colors">
                Get Early Access
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
