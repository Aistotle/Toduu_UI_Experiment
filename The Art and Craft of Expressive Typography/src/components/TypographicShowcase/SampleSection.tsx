import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface SampleSectionProps {
  title: string;
  description: string;
  demo: React.ReactNode;
}

export const SampleSection: React.FC<SampleSectionProps> = ({ title, description, demo }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="md:col-span-1">
          <p className="text-xs uppercase tracking-[0.5em] text-[color:rgba(17,17,17,0.45)] mb-4">Interaction Study</p>
          <h3 className="text-3xl font-semibold leading-tight text-[var(--ink)]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h3>
          <p className="text-[color:rgba(17,17,17,0.65)] leading-relaxed mt-4">
            {description}
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="min-h-[250px] md:min-h-[320px] rounded-[32px] border border-black/10 bg-white/90 p-8 flex items-center justify-center shadow-[0px_25px_65px_rgba(0,0,0,0.08)]">
            {demo}
          </div>
        </div>
      </div>
    </section>
  );
};
