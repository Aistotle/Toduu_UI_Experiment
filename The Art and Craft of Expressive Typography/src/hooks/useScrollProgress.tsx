import { useState, useEffect, RefObject } from 'react';

export const useScrollProgress = <T extends HTMLElement,>(ref: RefObject<T>): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { top, height } = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distance = viewportHeight - top;
      const totalDistance = viewportHeight + height;
      let currentProgress = distance / totalDistance;
      currentProgress = Math.max(0, Math.min(1, currentProgress));

      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return progress;
};
