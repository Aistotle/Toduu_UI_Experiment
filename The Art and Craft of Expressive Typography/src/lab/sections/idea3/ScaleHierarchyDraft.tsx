import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { PinnedViewport } from '../../components/PinnedViewport';
import { SectionIntro } from '../../components/SectionIntro';
import { Idea03WeightStudy } from './WeightStudy';

const PIN_DISTANCE = '+=400%';

export const Idea03ScaleHierarchyDraft: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const weightSectionRef = useRef<HTMLElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    setup: ({ gsap, ScrollTrigger }) => {
      if (!sectionRef.current || !textRef.current) return;
      const topOverlay = document.getElementById('scale-overlay-top');
      const bottomOverlay = document.getElementById('scale-overlay-bottom');
      if (topOverlay) gsap.set(topOverlay, { opacity: 0 });
      if (bottomOverlay) gsap.set(bottomOverlay, { opacity: 0 });
      if (weightSectionRef.current) {
        gsap.set(weightSectionRef.current, { autoAlpha: 0, y: 80 });
      }

      const syncOverlay = (overlay: HTMLElement | null, shouldShow: boolean, immediate = false) => {
        if (!overlay) return;
        gsap.to(overlay, {
          opacity: shouldShow ? 1 : 0,
          duration: immediate ? 0 : 0.25,
          overwrite: true,
        });
      };

      const bottomThreshold = 0.85;
      const topThreshold = 0.98;
      let weightVisible = false;

      const syncWeight = (shouldShow: boolean, immediate = false) => {
        if (!weightSectionRef.current || weightVisible === shouldShow) return;
        weightVisible = shouldShow;
        gsap.to(weightSectionRef.current, {
          autoAlpha: shouldShow ? 1 : 0,
          y: shouldShow ? 0 : 60,
          duration: immediate ? 0 : 0.35,
          ease: 'power2.out',
        });
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: true,
          onUpdate: (self) => {
            const { progress } = self;
            const bottomActive = progress >= bottomThreshold;
            const topActive = progress >= topThreshold;
            syncOverlay(bottomOverlay, bottomActive);
            syncOverlay(topOverlay, topActive);
            syncWeight(topActive);
          },
          onEnterBack: (self) => {
            const { progress } = self;
            const bottomActive = progress >= bottomThreshold;
            const topActive = progress >= topThreshold;
            syncOverlay(bottomOverlay, bottomActive, true);
            syncOverlay(topOverlay, topActive, true);
            syncWeight(topActive, true);
          },
        },
      });

      let releaseTrigger: ScrollTrigger | undefined;
      const nextSection = weightSectionRef.current?.nextElementSibling as HTMLElement | null;
      if (nextSection) {
        releaseTrigger = ScrollTrigger.create({
          trigger: nextSection,
          start: 'top 80%'
            ,
          onEnter: () => {
            syncOverlay(bottomOverlay, false);
            syncOverlay(topOverlay, false);
            syncWeight(false);
          },
          onLeaveBack: () => {
            const progress = timeline.scrollTrigger?.progress ?? 0;
            const bottomActive = progress >= bottomThreshold;
            const topActive = progress >= topThreshold;
            syncOverlay(bottomOverlay, bottomActive, true);
            syncOverlay(topOverlay, topActive, true);
            syncWeight(topActive, true);
          },
        });
      }

      timeline.to(textRef.current, {
        scale: 6,
        rotate: -4,
        xPercent: 8,
        yPercent: -2,
        transformOrigin: 'center center',
        ease: 'none',
      });

      timeline.to(textRef.current, {
        scale: 26,
        rotate: -6,
        xPercent: 42,
        yPercent: -4,
        transformOrigin: 'center center',
        ease: 'none',
      });

      timeline.to(textRef.current, {
        scale: 80,
        rotate: -7,
        xPercent: 150,
        yPercent: -6,
        color: '#000000',
        transformOrigin: 'center center',
        ease: 'none',
      });

      timeline.to(textRef.current, {
        scale: 320,
        rotate: -7,
        xPercent: 360,
        yPercent: -10,
        color: '#000000',
        transformOrigin: 'center center',
        ease: 'none',
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        syncOverlay(bottomOverlay, false, true);
        syncOverlay(topOverlay, false, true);
        syncWeight(false, true);
        releaseTrigger?.kill();
      };
    },
  });

  return (
    <div ref={wrapperRef} className="space-y-0">
      <PinnedViewport ref={sectionRef} pinDistance={PIN_DISTANCE} className="overflow-hidden bg-white">
        <div className="absolute top-10 left-6 md:left-16 z-10 max-w-sm">
          <SectionIntro
            eyebrow="Idea 03 · 01"
            title="Scale = Hierarchy"
            description="Pinned viewport magnifies a single word until it fills the frame. This draft experiments with a refined zoom path to land on solid black."
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
      <section
        ref={weightSectionRef}
        className="bg-black px-6 py-20 text-white opacity-0"
        aria-hidden
      >
        <Idea03WeightStudy variant="embedded" />
      </section>
    </div>
  );
};

export default Idea03ScaleHierarchyDraft;
