import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SectionIntro } from '../../components/SectionIntro';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';

const ladderSteps = [
  {
    id: 'large',
    label: 'ENORMOUS',
    className: 'text-[clamp(3.5rem,11vw,7rem)] font-black uppercase tracking-tight',
    tone: 'text-slate-900',
  },
  {
    id: 'medium',
    label: 'Medium',
    className: 'text-[clamp(2.5rem,8vw,4.5rem)] font-semibold',
    tone: 'text-slate-800',
  },
  {
    id: 'small',
    label: 'small',
    className: 'text-[clamp(1.5rem,5vw,2.4rem)] font-medium',
    tone: 'text-slate-600',
  },
  {
    id: 'tiny',
    label: 'whisper',
    className: 'text-[clamp(0.9rem,4vw,1.4rem)] font-normal tracking-[0.3em] text-sm md:text-base',
    tone: 'text-slate-500',
  },
];

export const Idea01ScaleLadder: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rungRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const resetTimer = useRef<number>();

  const registerRung = (index: number) => (node: HTMLButtonElement | null) => {
    rungRefs.current[index] = node;
  };

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const pulseRung = (index: number) => {
    const target = rungRefs.current[index];
    if (!target) return;

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    setActiveIndex(index);
    gsap.killTweensOf(target);
    gsap.to(target, {
      scale: 1.08,
      duration: 0.22,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });

    resetTimer.current = window.setTimeout(() => {
      setActiveIndex(null);
    }, 650);
  };

  useGsapTimeline({
    scope: sectionRef,
    setup: ({ gsap }) => {
      if (!sectionRef.current) return;

      const heading = sectionRef.current.querySelector('[data-scale-heading]');
      const caption = sectionRef.current.querySelector('[data-scale-caption]');
      const steps = rungRefs.current.filter((el): el is HTMLButtonElement => Boolean(el));

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      if (heading) {
        timeline.from(heading, { opacity: 0, y: 40 });
      }

      if (caption) {
        timeline.from(caption, { opacity: 0, y: 20 }, '-=0.4');
      }

      if (steps.length) {
        timeline.from(steps, { opacity: 0, y: 40, stagger: 0.12 }, '-=0.3');
      }

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] border border-slate-100 bg-gray-50 px-6 py-16 shadow-[0_35px_80px_rgba(15,23,42,0.08)]"
    >
      <div data-scale-heading className="mx-auto max-w-3xl text-center">
        <SectionIntro
          align="center"
          eyebrow="Idea 01 · Scale"
          title="Scale"
          description="The hierarchy of importance. Click each rung to feel how the volume changes."
        />
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {ladderSteps.map((step, index) => (
          <button
            key={step.id}
            ref={registerRung(index)}
            type="button"
            onClick={() => pulseRung(index)}
            className={`group rounded-[28px] border border-white/40 bg-white/80 px-4 py-6 text-center font-playfair shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
              activeIndex === index ? 'ring-2 ring-indigo-200 shadow-[0_25px_70px_rgba(79,70,229,0.25)] bg-white' : ''
            }`}
            aria-pressed={activeIndex === index}
          >
            <span className={`${step.className} ${step.tone}`}>{step.label}</span>
          </button>
        ))}
      </div>

      <p
        data-scale-caption
        className="mt-10 text-center text-base text-slate-600"
      >
        <em>Click any size to see the impact</em>
      </p>
    </section>
  );
};

export default Idea01ScaleLadder;
