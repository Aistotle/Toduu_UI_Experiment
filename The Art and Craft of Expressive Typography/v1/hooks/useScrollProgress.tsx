
import { useState, useEffect, RefObject } from 'react';

export const useScrollProgress = <T extends HTMLElement,>(ref: RefObject<T>): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { top, height } = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate the distance the element has been visible in the viewport
      const distance = viewportHeight - top;

      // Total scrollable distance for the element to pass through the viewport
      const totalDistance = viewportHeight + height;

      // Calculate progress as a value from 0 to 1
      let currentProgress = distance / totalDistance;

      // Clamp the progress between 0 and 1
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return progress;
};
