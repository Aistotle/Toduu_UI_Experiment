import { useEffect, useState } from 'react';

interface EntranceItem {
  delay: number;
  duration: number;
}

interface EntranceState {
  opacity: number;
  transform: string;
  transition: string;
}

/**
 * Orchestrates staggered entrance animations with the Toduu easing curve.
 * Returns an array of style objects that transition from hidden to visible.
 */
export function useStaggeredEntrance(items: EntranceItem[]): EntranceState[] {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Trigger entrance on mount
    const timer = requestAnimationFrame(() => {
      setHasEntered(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return items.map(({ delay, duration }) => ({
    opacity: hasEntered ? 1 : 0,
    transform: hasEntered ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity ${duration}ms cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.32, 0.72, 0, 1) ${delay}ms`,
  }));
}
