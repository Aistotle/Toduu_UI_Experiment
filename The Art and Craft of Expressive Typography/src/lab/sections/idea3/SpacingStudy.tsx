import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { PinnedViewport } from '../../components/PinnedViewport';
import { SectionIntro } from '../../components/SectionIntro';

const PIN_DISTANCE = '+=220%';

export const Idea03SpacingStudy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const breatheRef = useRef<HTMLHeadingElement | null>(null);
  const tensionRef = useRef<HTMLHeadingElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [],
    setup: ({ gsap }) => {
      if (!sectionRef.current || !breatheRef.current || !tensionRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: true,
        },
      });

      tl.to(breatheRef.current, {
        letterSpacing: '1.2em',
        duration: 1,
        ease: 'none',
      }).to(
        tensionRef.current,
        {
          letterSpacing: '-0.08em',
          opacity: 1,
          duration: 1,
          ease: 'none',
        },
        0.3
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
  });

  return (
    <PinnedViewport
      ref={sectionRef}
      pinDistance={PIN_DISTANCE}
      className="overflow-hidden rounded-[32px] bg-neutral-50"
    >
      <div className="absolute top-12 left-6 md:left-16 z-10 max-w-md">
        <SectionIntro
          eyebrow="Idea 03 · 03"
          title="Spacing controls breath"
          description="Sticky viewport staging where BREATHE expands while TENSION compresses, matching the original scroll lab."
        />
      </div>
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-24 text-center">
        <h3
          ref={breatheRef}
          className="text-4xl md:text-7xl font-light uppercase tracking-[0em]"
        >
          B R E A T H E
        </h3>
        <h3
          ref={tensionRef}
          className="text-5xl md:text-8xl font-black uppercase tracking-[0.2em] opacity-70"
        >
          TENSION
        </h3>
      </div>
    </PinnedViewport>
  );
};

export default Idea03SpacingStudy;
