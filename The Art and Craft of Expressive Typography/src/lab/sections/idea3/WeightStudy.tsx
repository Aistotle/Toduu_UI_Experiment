import React, { useRef } from 'react';
import { useGsapTimeline } from '../../hooks/useGsapTimeline';
import { SectionIntro } from '../../components/SectionIntro';

export const weightSteps = ['Light', 'Regular', 'Medium', 'Bold', 'Black'];

type WeightStudyVariant = 'lab' | 'embedded';

type Idea03WeightStudyProps = {
  variant?: WeightStudyVariant;
  className?: string;
};

export const Idea03WeightStudy: React.FC<Idea03WeightStudyProps> = ({ variant = 'lab', className }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const registerLine = (index: number) => (el: HTMLSpanElement | null) => {
    lineRefs.current[index] = el;
  };

  useGsapTimeline({
    scope: containerRef,
    dependencies: [],
    setup: ({ gsap }) => {
      if (!containerRef.current) return;
      const cleanups: Array<() => void> = [];

      lineRefs.current.forEach((line) => {
        if (!line) return;
        const tween = gsap.fromTo(
          line,
          { fontWeight: 100, letterSpacing: '0.5em', filter: 'blur(6px)', opacity: 0.4 },
          {
            fontWeight: 900,
            letterSpacing: '-0.05em',
            filter: 'blur(0px)',
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top center',
              end: 'bottom center',
              scrub: true,
            },
          }
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
  });

  const Wrapper = variant === 'lab' ? 'section' : 'div';
  const wrapperClasses =
    variant === 'lab'
      ? 'rounded-[32px] bg-neutral-900 px-6 py-20 text-white'
      : 'bg-neutral-900 px-6 py-20 text-white w-full';

  return (
    <Wrapper ref={containerRef} className={`${wrapperClasses} ${className ?? ''}`}>
      <div className="mx-auto max-w-2xl text-center">
        <SectionIntro
          eyebrow="Idea 03 · 02"
          title="Weight = Gravitas"
          description="Each row drifts from whisper to roar as you scroll, inheriting the gravitas demo from new-ideas-3."
          align="center"
          variant="dark"
        />
      </div>
      <div className="mt-12 flex flex-col items-center space-y-6 text-4xl font-black uppercase md:text-6xl">
        {weightSteps.map((label, index) => (
          <span
            key={label}
            ref={registerLine(index)}
            className="transition-[font-weight,letter-spacing,filter,opacity]"
          >
            {label}
          </span>
        ))}
      </div>
    </Wrapper>
  );
};

export default Idea03WeightStudy;
