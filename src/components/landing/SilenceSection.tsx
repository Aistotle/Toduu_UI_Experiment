import { useEffect, useRef, useState } from 'react';

export function SilenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress as section moves through viewport
      // 0 = section just entering, 0.5 = section centered, 1 = section leaving
      const progress = 1 - (rect.top + rect.height / 2) / (windowHeight + rect.height / 2);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      setScrollProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll - peaks in middle
  const opacity = scrollProgress < 0.5
    ? scrollProgress * 2
    : 2 - scrollProgress * 2;

  // Calculate Y offset for parallax effect
  const yOffset = (scrollProgress - 0.5) * -100;

  return (
    <section
      ref={sectionRef}
      className="min-h-[120vh] relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0F0F0F' }}
    >
      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border"
          style={{ borderColor: 'rgba(247, 246, 243, 0.2)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border"
          style={{ borderColor: 'rgba(247, 246, 243, 0.1)' }}
        />
      </div>

      {/* Content with parallax */}
      <div
        className="text-center max-w-2xl px-6 relative z-10 transition-transform duration-100"
        style={{
          opacity: Math.max(0.1, opacity),
          transform: `translateY(${yOffset}px)`,
        }}
      >
        <h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 font-light"
          style={{ color: '#F7F6F3' }}
        >
          Silence defines sound.
        </h2>
        <p
          className="font-sans text-lg md:text-xl font-light leading-relaxed"
          style={{ color: 'rgba(247, 246, 243, 0.8)' }}
        >
          Negative space is not empty. It is active. It provides the pause that
          gives the content meaning. Without the white space, the black ink has
          no definition.
        </p>
      </div>
    </section>
  );
}
