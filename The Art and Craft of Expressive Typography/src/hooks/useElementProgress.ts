import { useEffect, useState } from 'react';

export function useElementProgress(el: HTMLElement | null, margin = 0): number {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const boundedTop = Math.min(viewportHeight, Math.max(-rect.height, rect.top - margin));
      const total = Math.max(1, rect.height + viewportHeight - margin * 2);
      const progress = 1 - (boundedTop + rect.height) / total;
      setT(Math.max(0, Math.min(1, progress)));
    };

    const options: AddEventListenerOptions = { passive: true };
    onScroll();
    window.addEventListener('scroll', onScroll, options);
    window.addEventListener('resize', onScroll, options);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [el, margin]);

  return t;
}
