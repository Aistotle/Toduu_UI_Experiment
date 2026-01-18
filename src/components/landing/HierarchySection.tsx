import { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';

const PIN_DISTANCE = '+=650%';

interface HierarchySectionProps {
  onGrainOpacity?: (opacity: number) => void;
}

export function HierarchySection({ onGrainOpacity }: HierarchySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<SVGSVGElement | null>(null);
  const blackOverlayRef = useRef<HTMLDivElement | null>(null);
  const typographyRef = useRef<HTMLDivElement | null>(null);
  const frauncesTitleRef = useRef<HTMLParagraphElement | null>(null);
  const frauncesWeightsRef = useRef<HTMLDivElement | null>(null);
  const dmSansTitleRef = useRef<HTMLParagraphElement | null>(null);
  const dmSansWeightsRef = useRef<HTMLDivElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [],
    setup: ({ gsap, ScrollTrigger }) => {
      if (!sectionRef.current || !textRef.current) return;

      // Pin the section while scrolling
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: PIN_DISTANCE,
        scrub: true,
        pin: true,
        pinSpacing: true,
      });

      // Animate the text scale
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: true,
        },
      });

      // Stage 1: Initial growth
      timeline.to(textRef.current, {
        scale: 6,
        rotate: -4,
        xPercent: 8,
        yPercent: -2,
        transformOrigin: 'center center',
        ease: 'none',
      });

      // Stage 2: Letters start filling frame + grain fades out
      timeline.to(textRef.current, {
        scale: 26,
        rotate: -6,
        xPercent: 42,
        yPercent: -4,
        transformOrigin: 'center center',
        ease: 'none',
        onUpdate: function() {
          const progress = this.progress();
          if (onGrainOpacity) {
            onGrainOpacity(0.03 * (1 - progress));
          }
        },
      });

      // Stage 3: Almost all black
      timeline.to(textRef.current, {
        scale: 80,
        rotate: -7,
        xPercent: 150,
        yPercent: -6,
        transformOrigin: 'center center',
        ease: 'none',
      });

      // Stage 4: Complete blackout + black overlay fades in
      timeline.to(textRef.current, {
        scale: 320,
        rotate: -7,
        xPercent: 360,
        yPercent: -10,
        transformOrigin: 'center center',
        ease: 'none',
      });

      // Fade in clean black overlay
      if (blackOverlayRef.current) {
        timeline.to(blackOverlayRef.current, {
          opacity: 1,
          ease: 'none',
          duration: 0.3,
        }, '-=0.2');
      }

      // Stage 5: Typography showcase fades in
      if (typographyRef.current) {
        timeline.to(typographyRef.current, {
          opacity: 1,
          visibility: 'visible',
          ease: 'power2.out',
          duration: 0.5,
        });
      }

      // Staggered animation for Fraunces
      if (frauncesTitleRef.current) {
        timeline.fromTo(frauncesTitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
          '-=0.3'
        );
      }
      if (frauncesWeightsRef.current) {
        timeline.fromTo(frauncesWeightsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 0.3 },
          '-=0.2'
        );
      }

      // Staggered animation for DM Sans
      if (dmSansTitleRef.current) {
        timeline.fromTo(dmSansTitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
          '-=0.2'
        );
      }
      if (dmSansWeightsRef.current) {
        timeline.fromTo(dmSansWeightsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 0.3 },
          '-=0.2'
        );
      }

      // Hold at the end briefly
      timeline.to({}, { duration: 0.5 });

      return () => {
        pinTrigger.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-bg overflow-hidden"
    >
      {/* HIERARCHY text - SVG for infinite vector scaling */}
      <div className="flex min-h-screen items-center justify-center">
        <svg
          ref={textRef}
          viewBox="0 0 600 100"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: 'clamp(18rem, 60vw, 48rem)',
            height: 'auto',
            willChange: 'transform',
            overflow: 'visible',
          }}
          role="heading"
          aria-level={2}
          aria-label="HIERARCHY"
        >
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1F1B16"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '72px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            HIERARCHY
          </text>
        </svg>
      </div>

      {/* Clean black overlay - fades in at Stage 4 */}
      <div
        ref={blackOverlayRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ backgroundColor: '#1F1B16' }}
      />

      {/* Typography showcase - appears after blackout */}
      <div
        ref={typographyRef}
        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 invisible"
        style={{ backgroundColor: '#1F1B16' }}
      >
        <div className="text-center space-y-16 px-8">
          {/* Fraunces showcase */}
          <div className="space-y-6">
            <p
              ref={frauncesTitleRef}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-black"
              style={{ color: '#F7F6F3' }}
            >
              Fraunces
            </p>
            <div
              ref={frauncesWeightsRef}
              className="flex flex-wrap justify-center gap-6 md:gap-10 text-lg md:text-2xl"
              style={{ color: 'rgba(247, 246, 243, 0.5)' }}
            >
              <span className="font-serif font-light">Light</span>
              <span className="font-serif font-normal">Regular</span>
              <span className="font-serif font-semibold">Semibold</span>
              <span className="font-serif font-black">Black</span>
            </div>
          </div>

          {/* DM Sans showcase */}
          <div className="space-y-6">
            <p
              ref={dmSansTitleRef}
              className="font-sans text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight"
              style={{ color: '#F7F6F3' }}
            >
              DM Sans
            </p>
            <div
              ref={dmSansWeightsRef}
              className="flex flex-wrap justify-center gap-6 md:gap-10 text-base md:text-xl"
              style={{ color: 'rgba(247, 246, 243, 0.5)' }}
            >
              <span className="font-sans font-light">Light</span>
              <span className="font-sans font-normal">Regular</span>
              <span className="font-sans font-medium">Medium</span>
              <span className="font-sans font-bold">Bold</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
