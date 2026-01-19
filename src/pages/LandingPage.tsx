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

        {/* Social proof section */}
        <section className="py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto px-8">
            <p className="text-center text-stone-400 text-sm uppercase tracking-widest mb-12">
              Trusted by focused minds
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-stone-800 mb-2">12K+</p>
                <p className="text-stone-500">Active users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-stone-800 mb-2">98%</p>
                <p className="text-stone-500">Completion rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-stone-800 mb-2">4.9</p>
                <p className="text-stone-500">User rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-8">
            <h3 className="text-3xl font-display text-stone-800 text-center mb-16">
              Three steps to clarity
            </h3>
            <div className="flex justify-between items-start gap-12">
              <div className="flex-1 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <p className="text-stone-700 font-medium">Capture</p>
                <p className="text-stone-500 text-sm mt-1">Write it down, let it go</p>
              </div>
              <div className="flex-1 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <p className="text-stone-700 font-medium">Focus</p>
                <p className="text-stone-500 text-sm mt-1">One thing at a time</p>
              </div>
              <div className="flex-1 text-center">
                <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <p className="text-stone-700 font-medium">Complete</p>
                <p className="text-stone-500 text-sm mt-1">Feel the momentum</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial quote */}
        <section className="py-16 bg-stone-100">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <blockquote className="text-2xl text-stone-600 italic font-display leading-relaxed">
              "Finally, a tool that respects my attention instead of demanding it."
            </blockquote>
            <p className="mt-6 text-stone-500">— A focused user</p>
          </div>
        </section>

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
