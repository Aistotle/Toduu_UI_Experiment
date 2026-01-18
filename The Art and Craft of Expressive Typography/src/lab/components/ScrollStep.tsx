import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type ScrollStepRenderProps = {
  visible: boolean;
};

type ScrollStepProps = {
  children: ReactNode | ((props: ScrollStepRenderProps) => ReactNode);
  threshold?: number;
  once?: boolean;
  className?: string;
  inactiveClassName?: string;
  forceVisible?: boolean;
};

export const ScrollStep: React.FC<ScrollStepProps> = ({
  children,
  threshold = 0.35,
  once = true,
  className = '',
  inactiveClassName = 'opacity-0 translate-y-8',
  forceVisible = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const supportsObserver = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return typeof window.IntersectionObserver !== 'undefined';
  }, []);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const shouldAnimate = !forceVisible && supportsObserver && !prefersReducedMotion;
  const [visible, setVisible] = useState(() => !shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) return undefined;
    const target = ref.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldAnimate, threshold, once]);

  const content =
    typeof children === 'function'
      ? children({ visible })
      : children;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : inactiveClassName
      } ${className}`}
    >
      {content}
    </div>
  );
};

export default ScrollStep;
