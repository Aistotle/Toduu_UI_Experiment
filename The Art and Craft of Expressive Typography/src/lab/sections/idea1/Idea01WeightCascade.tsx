import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { SectionIntro } from '../../components/SectionIntro';

const weightSteps: Array<{ label: string; weight: number }> = [
  { label: 'Ethereal', weight: 100 },
  { label: 'Light', weight: 300 },
  { label: 'Regular', weight: 400 },
  { label: 'Confident', weight: 600 },
  { label: 'BOLD', weight: 900 },
];

export const Idea01WeightCascade: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const specimenRefs = useRef<Array<HTMLDivElement | null>>([]);

  const registerSpecimen = (index: number) => (el: HTMLDivElement | null) => {
    specimenRefs.current[index] = el;
  };

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [],
    setup: ({ gsap }) => {
      if (!sectionRef.current) return;

      const targets = specimenRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      if (!targets.length) return;

      const timeline = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      timeline.from(targets, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] bg-gradient-to-b from-white via-white to-slate-50 px-6 py-16"
    >
      <div className="mx-auto max-w-3xl">
        <SectionIntro
          eyebrow="Idea 01 · Weight"
          title="The Gravity of Words"
          description="Five quick steps from 100 -> 900 modeled after the cascade demo in new-ideas-1."
          align="center"
        />
      </div>

      <div className="mt-12 flex flex-col items-center space-y-6 text-center">
        {weightSteps.map((specimen, index) => (
          <div
            key={specimen.label}
            ref={registerSpecimen(index)}
            className="font-playfair text-4xl md:text-6xl transition-transform duration-300 ease-out hover:scale-[1.03]"
            style={{ fontWeight: specimen.weight }}
          >
            {specimen.label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Idea01WeightCascade;
