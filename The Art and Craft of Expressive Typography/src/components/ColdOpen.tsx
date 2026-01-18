import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useElementProgress } from '../hooks/useElementProgress';

const easeInOutQuad = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefers(media.matches);
    update();
    const listener = () => update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  return prefers;
};

export const ColdOpen: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setNode(ref.current);
  }, []);

  const prefersReducedMotion = usePrefersReducedMotion();
  const progress = useElementProgress(node, 0);
  const effectiveProgress = prefersReducedMotion ? 0.5 : progress;
  const eased = useMemo(() => easeInOutQuad(effectiveProgress), [effectiveProgress]);

  const weight = 300 + eased * 600; // 300 -> 900
  const opticalSize = 36 + eased * 36; // 36 -> 72
  const tracking = (1 - eased) * 0.02 - eased * 0.01; // open early, tighten slightly at peak

  return (
    <section ref={ref} className="h-screen flex flex-col items-center justify-center px-4 select-none">
      <h1 className="leading-none tracking-tight text-center">
        <Link
          to="/expressive-lab"
          aria-label="Open the Expressive Lab workspace"
          className="group block text-[clamp(48px,10vw,140px)] font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            fontFamily: 'Fraunces, serif',
            fontVariationSettings: `"wght" ${weight}, "opsz" ${opticalSize}`,
            letterSpacing: `${tracking}em`,
          }}
        >
          <span className="inline-block transition-colors duration-300 group-hover:text-black/70">EXPRESSIVE</span>
        </Link>
        <Link
          to="/typography-lab"
          aria-label="Open the Typography Lab workspace"
          className="group block text-[clamp(36px,7vw,96px)] font-light tracking-[0.08em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="inline-block transition-colors duration-300 group-hover:text-black/70">TYPOGRAPHY</span>
        </Link>
      </h1>
      <noscript className="sr-only">Expressive Typography</noscript>
    </section>
  );
};
