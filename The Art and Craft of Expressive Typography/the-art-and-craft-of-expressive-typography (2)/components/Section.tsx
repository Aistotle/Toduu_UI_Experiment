
import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface SectionProps {
  title: string;
  description: string;
  demoComponent: React.ReactNode;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, description, demoComponent }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>
          <p className="text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="md:col-span-2 flex items-center justify-center min-h-[250px] md:min-h-[300px] bg-gray-800/50 rounded-lg p-8">
          {demoComponent}
        </div>
      </div>
    </section>
  );
};

export default Section;
