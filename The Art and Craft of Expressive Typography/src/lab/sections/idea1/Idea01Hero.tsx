import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';

export const Idea01Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLParagraphElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    setup: ({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 100, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 }
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
      }

      if (promptRef.current) {
        tl.fromTo(
          promptRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        );

        gsap.to(promptRef.current, {
          y: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          duration: 1.5,
        });
      }

      return () => {
        if (promptRef.current) {
          gsap.killTweensOf(promptRef.current);
        }
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-20 text-center shadow-[0_35px_90px_rgba(15,23,42,0.08)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-black/40">Idea 01 · Immersive Scroll Narrative</p>
        <div
          ref={titleRef}
          className="mt-8 font-playfair text-[clamp(3rem,12vw,11rem)] font-black leading-[0.85] tracking-[-0.04em] text-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 bg-clip-text"
        >
          <span className="block">The Art</span>
          <span className="block font-space font-light text-[clamp(2rem,8vw,5rem)] leading-[0.9] tracking-[0.08em] text-slate-600">
            and
          </span>
          <span className="block">Craft</span>
        </div>
        <p ref={copyRef} className="mt-10 text-xl md:text-2xl text-black/70">
          of Expressive Typography
        </p>
        <div ref={promptRef} className="mt-12 text-sm font-jetbrains uppercase tracking-[0.4em] text-black/45">
          scroll to explore ↓
        </div>
      </div>
    </section>
  );
};

export default Idea01Hero;
