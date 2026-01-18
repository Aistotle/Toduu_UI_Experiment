import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { PinnedViewport } from '../../components/PinnedViewport';
import { SectionIntro } from '../../components/SectionIntro';

const PIN_DISTANCE = '+=200%';

export const Idea03ScaleStudy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [],
    setup: ({ gsap }) => {
      if (!sectionRef.current || !textRef.current) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: true,
        },
      });

      timeline.to(textRef.current, {
        scale: 6,
        rotate: -5,
        transformOrigin: 'center center',
        ease: 'none',
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
  });

  return (
    <PinnedViewport
      ref={sectionRef}
      pinDistance={PIN_DISTANCE}
      className="overflow-hidden rounded-[32px] bg-white"
    >
      <div className="absolute top-10 left-6 md:left-16 z-10 max-w-sm">
        <SectionIntro
          eyebrow="Idea 03 · 01"
          title="Scale = Hierarchy"
          description="Pinned viewport magnifies a single word until it fills the entire frame, mirroring the scale study from new-ideas-3."
        />
      </div>
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2
          ref={textRef}
          className="text-[clamp(3rem,8vw,7rem)] font-black uppercase tracking-tight"
        >
          HIERARCHY
        </h2>
      </div>
    </PinnedViewport>
  );
};

export default Idea03ScaleStudy;
