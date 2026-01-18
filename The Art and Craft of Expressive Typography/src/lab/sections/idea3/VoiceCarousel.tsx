import React, { useMemo, useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { SectionIntro } from '../../components/SectionIntro';

const voiceCards = [
  {
    label: 'Elegant / Traditional (Serif)',
    quote: '“I speak with tradition and gravitas.”',
    className: 'font-serif italic',
    bg: 'bg-[#f3e7e4]',
    text: 'text-[#5c2e2e]'
  },
  {
    label: 'Loud / Modern (Sans)',
    quote: '“I shout, modern and direct.”',
    className: 'font-sans font-black',
    bg: 'bg-[#e4f3e6]',
    text: 'text-[#1a4221]'
  },
  {
    label: 'Technical / Raw (Mono)',
    quote: '“I speak in code, precise and stoic.”',
    className: 'font-mono',
    bg: 'bg-[#e4e9f3]',
    text: 'text-[#1e2d4a]'
  },
  {
    label: 'Expressive / Dynamic',
    quote: '“I bend, flourish, and emote.”',
    className: 'font-serif italic font-bold',
    bg: 'bg-[#f3e4f1]',
    text: 'text-[#4a1e42]'
  }
];

export const Idea03VoiceCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const cards = useMemo(() => voiceCards, []);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [cards.length],
    setup: ({ gsap }) => {
      if (!sectionRef.current || !trackRef.current) return;
      const totalWidth = 100 * cards.length;
      const tween = gsap.to(trackRef.current, {
        xPercent: -100 * (cards.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          end: `+=${totalWidth}%`,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
  });

  return (
    <section ref={sectionRef} className="h-screen overflow-hidden rounded-[32px] bg-neutral-100">
      <div className="absolute top-10 left-6 md:left-16 z-10 max-w-md">
        <SectionIntro
          eyebrow="Idea 03 · 04"
          title="Typeface equals voice"
          description="Horizontal scroll snaps through voices so we can drop any card onto the main stage later."
        />
      </div>
      <div ref={trackRef} className="flex h-full w-[400%]">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`flex w-screen flex-col items-center justify-center gap-6 p-10 text-center ${card.bg} ${card.text}`}
          >
            <p className="text-xs font-mono uppercase tracking-[0.5em] opacity-60">{card.label}</p>
            <p className={`text-4xl md:text-6xl leading-tight ${card.className}`}>{card.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Idea03VoiceCarousel;
