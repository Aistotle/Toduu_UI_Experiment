import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';

export const Idea01Conclusion: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGsapTimeline({
    scope: sectionRef,
    dependencies: [],
    setup: ({ gsap }) => {
      if (!sectionRef.current) return;

      const revealElements = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-reveal]'));
      const tweens = revealElements.map((element, index) => {
        const tween = gsap.fromTo(
          element,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.08,
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        return tween;
      });

      return () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] border border-black/10 bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-20 text-center"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <p data-reveal className="text-xs font-mono uppercase tracking-[0.5em] text-black/50">
          Idea 01 · Finale
        </p>
        <h3
          data-reveal
          className="font-playfair text-4xl md:text-6xl font-semibold leading-tight text-gray-800"
        >
          The Craft Continues
        </h3>
        <p data-reveal className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          Typography is not just about making text readable—it's about making it <em>felt</em>.
        </p>
        <p data-reveal className="text-lg text-gray-600">
          Each choice in scale, weight, rhythm, spacing, voice, and silence contributes to the emotional resonance of your
          message.
        </p>
        <div data-reveal className="pt-6 text-sm font-mono text-gray-500">
          Thank you for reading ◦
        </div>
      </div>
    </section>
  );
};

export default Idea01Conclusion;
