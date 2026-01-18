import { DependencyList, RefObject, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type Scope = RefObject<Element | null> | Element | null | undefined;

type GsapTimelineSetup = (context: {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  scope: Element | null;
}) => void | (() => void);

type UseGsapTimelineOptions = {
  scope?: Scope;
  dependencies?: DependencyList;
  setup: GsapTimelineSetup;
};

let pluginsRegistered = false;

const ensurePlugins = () => {
  if (pluginsRegistered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
};

const resolveScope = (scope?: Scope) => {
  if (!scope) return null;
  if ('current' in scope) {
    return scope.current;
  }
  return scope;
};

export function useGsapTimeline({ scope, dependencies = [], setup }: UseGsapTimelineOptions) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;
    ensurePlugins();

    const scopeElement = resolveScope(scope);
    let cleanup: void | (() => void);

    const ctx = gsap.context(() => {
      cleanup = setup({ gsap, ScrollTrigger, scope: scopeElement });
    }, scopeElement ?? undefined);

    ScrollTrigger.refresh();

    return () => {
      cleanup?.();
      ctx.revert();
    };
  }, dependencies);
}
