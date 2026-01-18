import React, { useMemo, useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';

const headline = 'The Art & Craft of Expressive Typography';

export const Idea03HeroStudy: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  const words = useMemo(() => headline.split(' '), []);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [words.length],
    setup: ({ gsap, ScrollTrigger }) => {
      if (!titleRef.current) return;
      const textSpans = Array.from(titleRef.current.querySelectorAll('[data-word]'));

      gsap.fromTo(
        textSpans,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.08,
        }
      );

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            delay: 0.4,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      }

      if (!sectionRef.current) return;

      gsap.to(sectionRef.current, {
        yPercent: 30,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.idea03-hero-indicator', {
        y: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 1.4,
      });
    },
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-white px-6 py-20 text-center"
    >
      <div className="mb-6 text-xs font-mono uppercase tracking-[0.5em] text-black/40">Idea 03 · React + GSAP pinned hero</div>
      <h3 className="text-sm font-mono uppercase tracking-[0.7em] text-black/60">Concept Proof</h3>
      <h2
        ref={titleRef}
        className="mt-6 max-w-5xl text-balance text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-tight"
      >
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-word className="mr-3 inline-block">
            {word}
          </span>
        ))}
      </h2>
      <p ref={subtitleRef} className="mt-6 max-w-3xl text-lg text-black/60">
        This hero recreates the staggered reveal + parallax exit that anchors Idea 03. Drag the section onto the main page by
        importing <code className="mx-1 text-sm">{`<Idea03HeroStudy />`}</code> from the registry when it is production-ready.
      </p>
      <div className="idea03-hero-indicator mt-10 flex flex-col items-center text-xs font-mono uppercase tracking-[0.4em] text-black/40">
        <span>Scroll</span>
        <span className="mt-2 block h-12 w-px bg-black/20" />
      </div>
    </section>
  );
};

export default Idea03HeroStudy;
