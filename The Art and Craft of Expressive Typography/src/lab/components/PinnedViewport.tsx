import React, { forwardRef, MutableRefObject, ReactNode, useRef } from 'react';
import { useGsapTimeline } from '../hooks/useGsapTimeline';

type PinnedViewportProps = {
  children: ReactNode;
  className?: string;
  pinDistance?: string;
  pinSpacing?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const assignRef = (ref: React.Ref<HTMLElement>, value: HTMLElement | null) => {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  (ref as MutableRefObject<HTMLElement | null>).current = value;
};

export const PinnedViewport = forwardRef<HTMLElement, PinnedViewportProps>(
  (
    {
      children,
      className,
      pinDistance = '+=150%',
      pinSpacing = true,
      ...rest
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement | null>(null);

    useGsapTimeline({
      scope: localRef,
      dependencies: [pinDistance, pinSpacing],
      setup: ({ ScrollTrigger }) => {
        if (!localRef.current) return;
        const trigger = ScrollTrigger.create({
          trigger: localRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: true,
          pin: true,
          pinSpacing,
        });
        return () => trigger.kill();
      },
    });

    return (
      <section
        ref={(node) => {
          localRef.current = node;
          assignRef(forwardedRef, node);
        }}
        className={`relative min-h-[120vh] ${className ?? ''}`}
        {...rest}
      >
        {children}
      </section>
    );
  }
);

PinnedViewport.displayName = 'PinnedViewport';

export default PinnedViewport;
