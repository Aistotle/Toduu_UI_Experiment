import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

export const Idea01Introduction: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [prefersReducedMotion],
    setup: ({ gsap }) => {
      if (prefersReducedMotion) return;

      const targets = paragraphRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
      if (!targets.length) return;

      const tweens = targets.map((element, index) =>
        gsap.fromTo(
          element,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            delay: index * 0.12,
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      );

      return () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
        });
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-16 text-center"
    >
      <div className="max-w-3xl space-y-8">
        <p
          ref={(node) => {
            paragraphRefs.current[0] = node;
          }}
          className="text-2xl md:text-3xl font-light leading-relaxed text-black/80"
        >
          Typography is the{' '}
          <span className="font-playfair font-semibold text-black">voice</span> of written language.
        </p>
        <p
          ref={(node) => {
            paragraphRefs.current[1] = node;
          }}
          className="text-lg md:text-xl leading-relaxed text-black/70"
        >
          It whispers, shouts, sings, and sighs. Through careful manipulation of scale, weight, rhythm, and space, type becomes an
          instrument of expression—transforming mere words into experiences.
        </p>
      </div>
    </section>
  );
};

export default Idea01Introduction;
