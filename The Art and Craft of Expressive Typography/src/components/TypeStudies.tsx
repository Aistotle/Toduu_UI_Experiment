import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback, forwardRef } from "react";

/** Split a word into transformable letter spans */
interface SplitWordProps {
  text: string;
  className?: string;
  map?: (i: number, ch: string) => React.CSSProperties;
  as?: React.ElementType;
}

export const SplitWord = forwardRef<HTMLElement, SplitWordProps>(
  ({ text, className = "", map, as = "span" }, ref) => {
    const letters = useMemo(() => Array.from(text), [text]);
    const Comp: any = as;
    return (
      <Comp ref={ref} className={`inline-flex select-none will-change-transform ${className}`} aria-label={text}>
        {letters.map((ch, i) => (
          <span key={i} data-letter aria-hidden className="inline-block align-baseline" style={map ? map(i, ch) : undefined}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
        <span className="sr-only">{text}</span>
      </Comp>
    );
  }
);
SplitWord.displayName = "SplitWord";


const usePrefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1.1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const useSpringValue = (target: number, options?: { stiffness?: number; damping?: number; disabled?: boolean }) => {
  const { stiffness = 380, damping = 32, disabled = false } = options || {};
  const targetRef = useRef(target);
  targetRef.current = target;
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState({ value: target, velocity: 0 });

  useEffect(() => {
    if (!disabled) return;
    setState({ value: target, velocity: 0 });
  }, [target, disabled]);

  useEffect(() => {
    if (disabled) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }
    let mounted = true;
    const step = () => {
      setState((prev) => {
        const delta = targetRef.current - prev.value;
        const accel = stiffness * delta - damping * prev.velocity;
        const nextVelocity = prev.velocity + accel * 0.016;
        const nextValue = prev.value + nextVelocity * 0.016;
        if (Math.abs(delta) < 0.0005 && Math.abs(nextVelocity) < 0.0005) {
          if (Math.abs(prev.value - targetRef.current) < 0.0005) {
            return prev;
          }
          return { value: targetRef.current, velocity: 0 };
        }
        return { value: nextValue, velocity: nextVelocity };
      });
      if (!mounted) return;
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      mounted = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [stiffness, damping, disabled]);

  return disabled ? target : state.value;
};

/* 1) BROKEN — hinge and fall with gravity */
export const BrokenWord: React.FC<{ text:string; pivotIndex:number; progress: number; className?:string }> = ({ text, pivotIndex, progress, className="" }) => {
  const clamp = Math.max(0, Math.min(1, progress));
  const letters = Array.from(text);

  return (
    <span className={`inline-flex will-change-transform ${className}`} aria-label={text}>
      {letters.map((ch, i) => {
        if (i < pivotIndex - 1) {
          return (
            <span key={i} className="inline-block">
              {ch}
            </span>
          );
        }

        if (i === pivotIndex - 1) {
          const sag = clamp * 8;
          const lean = clamp * -1.5;
          return (
            <span
              key={i}
              className="inline-block"
              style={{
                display: 'inline-block',
                transform: `translate(${lean}px, ${sag}px) rotate(${clamp * -2}deg)`,
                transformOrigin: '100% 100%',
              }}
            >
              {ch}
            </span>
          );
        }

        if (i === pivotIndex) {
          const hinge = clamp * clamp;
          const releaseStart = 0.65;
          const release = clamp > releaseStart ? (clamp - releaseStart) / (1 - releaseStart) : 0;
          const rot = 8 + 40 * hinge;
          const drop = release * 18;
          const tuck = (1 - hinge) * -6;
          return (
            <span
              key={i}
              className="inline-block"
              style={{
                transformOrigin: '0% 60%',
                transform: `translate(${tuck}px, ${drop}px) rotate(${rot}deg)`,
                filter: release ? 'drop-shadow(0 2px 2px rgba(15,15,15,0.18))' : undefined,
                zIndex: letters.length - i,
              }}
            >
              {ch}
            </span>
          );
        }

        const offset = i - pivotIndex;
        const delay = offset * 0.1;
        const local = Math.max(0, Math.min(1, (clamp - delay) / (1 - delay)));
        const fall = local * local;
        const attachPull = (1 - local) * -10;
        const dx = attachPull + (offset * 14 + 8) * fall;
        const dy = (offset * 28 + 60) * fall;
        const rot = 20 + offset * (18 * fall);

        return (
          <span
            key={i}
            className="inline-block -ml-[0.015em]"
            style={{
              transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
              transformOrigin: '-10% 0%',
              filter: `drop-shadow(0 ${2 + fall * 3}px ${2 + fall}px rgba(0,0,0,0.22))`,
              zIndex: letters.length - i,
              opacity: 1 - fall * 0.1,
            }}
          >
            {ch}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </span>
  );
};

/* 2) (moved) — CalibratedMissingLetter now lives in its own component for measurement logic. */

/* 3) VIBRATE — responsive ghosts driven by progress */
export const VibrateWord: React.FC<{ text:string; progress?:number; className?:string }>
= ({ text, progress=1, className="" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [fontSize, setFontSize] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      if (!Number.isNaN(size)) setFontSize(size);
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const p = Math.max(0, Math.min(1, progress));
  const isSmall = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  const capHeight = fontSize || 32;
  const baseAmp = Math.min(isSmall ? 1.1 : 1.4, capHeight * 0.018);
  const extraAmp = Math.min(isSmall ? 3.4 : 4.8, capHeight * 0.07);
  const amp = prefersReduced ? 0 : baseAmp + extraAmp * p;
  const jitterDuration = `${Math.max(40, 60 - p * 15)}ms`;

  const ghosts = prefersReduced ? [] : [
    { dx: amp * 1.0, dy: amp * 0.22, alpha: 0.24 },
    { dx: -amp * 0.78, dy: -amp * 0.11, alpha: 0.17 },
    { dx: 0, dy: amp * 0.5, alpha: 0.12 },
  ];

  const baseWordStyle: React.CSSProperties | undefined = prefersReduced
    ? { textShadow: "0.18em 0.12em 0 rgba(0,0,0,0.25)" }
    : undefined;

  const motionStyle = prefersReduced
    ? undefined
    : ({
        animationDuration: jitterDuration,
        ["--jitter-x" as any]: `${amp * 0.7}px`,
        ["--jitter-y" as any]: `${amp * -0.45}px`,
      } as React.CSSProperties);

  return (
    <span
      ref={ref}
      className={`relative inline-flex select-none will-change-transform ${className}`}
      style={{ filter: "contrast(115%)" }}
      aria-label={text}
    >
      {ghosts.map((g, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute inset-0"
          style={{ color: `rgba(0,0,0,${g.alpha})`, transform: `translate(${g.dx}px, ${g.dy}px)` }}
        >
          {text}
        </span>
      ))}
      <span className={prefersReduced ? "relative" : "relative jitter-var"} style={{ ...baseWordStyle, ...motionStyle }}>
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
};

/* 4) SQUISH — squash & stretch with eased scroll progress */
export const SquishWord: React.FC<{ text:string; progress:number; max?:number; className?:string }>
= ({ text, progress, max=.32, className="" }) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const eased = easeOutBack(clamped);
  const scaleX = 1 + eased * max * 1.2;
  const scaleY = 1 - eased * max;
  const tracking = eased * 0.06 - 0.01;

  return (
    <span
      className={`inline-block origin-bottom will-change-transform ${className}`}
      style={{ transform: `scale(${scaleX}, ${scaleY})`, letterSpacing: `${tracking}em` }}
    >
      {text}
    </span>
  );
};

export const SquishScene: React.FC<{ text:string; progress:number; className?:string }>
= ({ text, progress, className="" }) => {
  const prefersReduced = usePrefersReducedMotion();
  const wordRef = useRef<HTMLElement>(null);
  const [capHeight, setCapHeight] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const node = wordRef.current;
    if (!node) return;
    const measure = () => {
      const size = parseFloat(window.getComputedStyle(node).fontSize);
      if (!Number.isNaN(size)) {
        setCapHeight(size * 0.68);
      }
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(node);
    } else {
      window.addEventListener("resize", measure);
    }
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const base = clamp(progress, 0, 1);
  const animatedPressure = useSpringValue(base, { disabled: prefersReduced });
  const pressure = prefersReduced ? 0.55 : clamp(animatedPressure, 0, 1.1);
  const retract = prefersReduced ? 0 : Math.max(0, pressure - base);
  const bounce = prefersReduced ? 0 : Math.max(0, base - pressure * 0.8);

  const stretchX = 1 + pressure * 0.55 + bounce * 0.2;
  const squashY = 1 - pressure * 0.38 + bounce * 0.12;
  const snapSkew = (retract - bounce) * 6;
  const tracking = -0.02 + pressure * 0.07 + bounce * 0.03;

  const mid = (text.length - 1) / 2 || 0;
  const letterMap = (index: number) => {
    const dist = Math.abs(index - mid) / (mid || 1);
    const centerBias = 1 - Math.pow(dist, 1.2);
    const sink = capHeight * pressure * centerBias * 0.12;
    const rebound = capHeight * bounce * (1 - dist) * 0.18;
    const localSquash = Math.max(0.56, squashY - centerBias * 0.12 + bounce * 0.05);
    const shear = (0.4 - dist) * pressure * 8 + snapSkew;
    return {
      transform: `translateY(${sink - rebound}px) scale(${1 + centerBias * 0.12}, ${localSquash}) skewX(${shear}deg)`
    };
  };

  const fieldOpacity = 0.18 + pressure * 0.45;
  const highlightOpacity = 0.2 + bounce * 0.6;

  return (
    <span className={`relative inline-flex leading-none select-none ${className}`}>
      <span aria-hidden className="absolute inset-0 -z-10 overflow-visible">
        <span
          className="absolute left-1/2 top-1/2 aspect-[3/1] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.35),_transparent_70%)]"
          style={{
            opacity: highlightOpacity,
            filter: `blur(${18 + pressure * 12}px)`,
            transform: `translate(-50%,-50%) scale(${1 + pressure * 0.25})`
          }}
        />
        <span
          className="absolute left-1/2 bottom-[-0.1em] h-[0.22em] w-[180%] -translate-x-1/2 rounded-full bg-black/60 blur-[22px]"
          style={{
            opacity: fieldOpacity,
            transform: `translate(-50%,0) scaleX(${1 + pressure * 0.9}) translateY(${capHeight * 0.08}px)`
          }}
        />
        <span className="absolute inset-0 squish-noise" style={{ opacity: clamp((pressure - 0.6) * 1.3, 0, 0.35) }} />
      </span>
      <span
        className="inline-flex origin-bottom transform-gpu tracking-tight"
        style={{
          transform: `skewX(${snapSkew}deg) scale(${stretchX}, ${squashY})`,
          letterSpacing: `${tracking}em`,
          color: `color-mix(in srgb, var(--ink) ${80 - pressure * 15}%, #ff5d8f ${pressure * 40}%)`
        }}
      >
        <SplitWord ref={wordRef as any} text={text} className="origin-bottom" map={letterMap} />
      </span>
    </span>
  );
};

/* 5) EXIT — the I is a door that opens on scroll; X leans toward it */
export const ExitWord: React.FC<{ progress: number, className?:string }> = ({ progress, className="" }) => {
  const p = Math.max(0, Math.min(1, progress * 1.8)); // Speed up animation
  return (
    <span className={`inline-flex items-baseline gap-[0.1em] font-black ${className}`} aria-label="EXIT">
      <span>E</span>
      <svg viewBox="0 0 120 120" width="0.85em" height="0.85em" aria-hidden className="align-[-0.05em] will-change-transform" style={{transform: `translateX(${-p * 5}%)`}}>
        <line x1="15" y1="105" x2="105" y2="15" stroke="currentColor" strokeWidth="24" strokeLinecap="round" />
        <line x1="15" y1="15" x2="105" y2="105" stroke="currentColor" strokeWidth="24" strokeLinecap="round" style={{ transformOrigin: '15px 15px', transform: `rotate(${p * 20}deg)`}} />
      </svg>
      <span style={{ perspective: '80px' }} className="inline-block">
        <span className="relative font-black inline-block will-change-transform" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${p * -80}deg)`}}>
          <span aria-hidden className="absolute inset-0 bg-neutral-800" style={{transform: 'translateZ(-2px)'}} >I</span>
          I
        </span>
      </span>
      <span className="will-change-transform" style={{transform: `translateX(${p*25}%)`}}>T</span>
    </span>
  );
};


/* 6) FLOAT — letters surf a sine baseline */
export const FloatWord: React.FC<{ text:string; amplitude?:number; speed?:number; className?:string }>
= ({ text, amplitude=8, speed=1, className="" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (usePrefersReducedMotion()) return;
    const el = ref.current; if (!el) return;
    const letters = el.querySelectorAll<HTMLSpanElement>("[data-letter]");
    let raf = 0; const t0 = performance.now();
    const tick = (t:number) => {
      const k = (t - t0)/1000;
      letters.forEach((node,i) => {
        const y = Math.sin(k*speed + i*.6) * amplitude;
        const r = Math.cos(k*speed + i*.6) * 2;
        node.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amplitude, speed]);
  return <SplitWord ref={ref} text={text} className={className}/>;
};

type Point = { x: number; y: number };
type LetterSample = { rect: DOMRect; char: string; index: number };

const normalizeLetter = (value: string | null) => {
  if (!value) return "";
  const normalized = value.replace(/\u00A0/g, " ");
  return normalized.trim().toLowerCase();
};

const makeLoopRing = (rect: DOMRect) => {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const rx = Math.max(rect.width * 0.24, 4);
  const ry = Math.max(rect.height * 0.32, 4);
  return {
    top: { x: cx, y: cy - ry },
    bottom: { x: cx, y: cy + ry },
    left: { x: cx - rx, y: cy },
    right: { x: cx + rx, y: cy },
    center: { x: cx, y: cy },
    rx,
    ry
  };
};

const localPoint = (box: DOMRect, point: Point) =>
  `${(point.x - box.left).toFixed(1)},${(point.y - box.top).toFixed(1)}`;

const buildLoopConnectorPath = (letters: LetterSample[], box: DOMRect): string | null => {
  if (!letters.length) return null;
  const oSamples = letters.filter((sample) => sample.char === "o");
  if (oSamples.length < 2) return null;

  const firstO = oSamples[0].rect;
  const secondO = oSamples[1].rect;
  const lRect = (letters.find((sample) => sample.char === "l") ?? letters[0]).rect;
  const pRect = (letters.find((sample) => sample.char === "p") ?? letters[letters.length - 1]).rect;

  const firstRing = makeLoopRing(firstO);
  const secondRing = makeLoopRing(secondO);

  const entry: Point = {
    x: lRect.right - lRect.width * 0.2,
    y: lRect.top + lRect.height * 0.08
  };

  const exit: Point = {
    x: pRect.left + pRect.width * 0.25,
    y: pRect.bottom - pRect.height * 0.2
  };

  const pinch: Point = {
    x: (firstRing.right.x + secondRing.left.x) / 2,
    y: firstRing.center.y + firstRing.ry * 0.15
  };

  const control1: Point = {
    x: entry.x + (firstRing.top.x - entry.x) * 0.6,
    y: Math.min(entry.y, firstRing.top.y) - firstO.height * 0.25
  };

  const control2: Point = {
    x: firstRing.right.x + (pinch.x - firstRing.right.x) * 0.45,
    y: firstRing.center.y + firstRing.ry * 0.85
  };

  const control3: Point = {
    x: pinch.x + (secondRing.left.x - pinch.x) * 0.45,
    y: pinch.y + secondRing.ry * 1.15
  };

  const control4: Point = {
    x: secondRing.right.x + (exit.x - secondRing.right.x) * 0.65,
    y: secondRing.bottom.y + (exit.y - secondRing.bottom.y) * 0.6
  };

  const arc = (ring: ReturnType<typeof makeLoopRing>, sweep: 0 | 1, target: Point) =>
    `A ${ring.rx.toFixed(1)} ${ring.ry.toFixed(1)} 0 1 ${sweep} ${localPoint(box, target)}`;

  return [
    `M ${localPoint(box, entry)}`,
    `Q ${localPoint(box, control1)} ${localPoint(box, firstRing.top)}`,
    arc(firstRing, 1, firstRing.bottom),
    arc(firstRing, 1, firstRing.top),
    `Q ${localPoint(box, control2)} ${localPoint(box, pinch)}`,
    `Q ${localPoint(box, control3)} ${localPoint(box, secondRing.bottom)}`,
    arc(secondRing, 0, secondRing.top),
    arc(secondRing, 0, secondRing.bottom),
    `Q ${localPoint(box, control4)} ${localPoint(box, exit)}`
  ].join(" ");
};

/* 7) LOOP — a single stroke that weaves through the letters */
export const LoopWord: React.FC<{ text?:string; className?:string }> = ({ text="loop", className="" }) => {
  const root = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const path = pathRef.current;
    if (!el || !path) return;

    const updatePath = () => {
      const letterNodes = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-letter]"));
      if (!letterNodes.length) return;

      const letters: LetterSample[] = letterNodes.map((node, index) => ({
        rect: node.getBoundingClientRect(),
        char: normalizeLetter(node.textContent),
        index
      }));

      const box = el.getBoundingClientRect();
      const d = buildLoopConnectorPath(letters, box);
      if (d) {
        path.setAttribute("d", d);
      } else {
        path.removeAttribute("d");
      }
    };

    updatePath();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updatePath);
      resizeObserver.observe(el);
    } else if (typeof window !== "undefined") {
      window.addEventListener("resize", updatePath);
    }

    return () => {
      resizeObserver?.disconnect();
      if (!resizeObserver && typeof window !== "undefined") {
        window.removeEventListener("resize", updatePath);
      }
    };
  }, [text]);
  return (
    <span ref={root} className={`relative inline-block ${className}`}>
      <SplitWord text={text}/>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden>
        <path ref={pathRef} d="" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
};


/* 8) HAPPY — continuous bouncy + quirky animation */
export const HappyWord: React.FC<{ text?:string; className?:string }> = ({ text="HAPPY", className="" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const rotations = useMemo(() => Array.from({length: text.length}, () => -10 + Math.random() * 20), [text.length]);

  useEffect(() => {
    if (usePrefersReducedMotion()) return;
    const el = ref.current; if (!el) return;
    const letters = el.querySelectorAll<HTMLSpanElement>("[data-letter]");
    let raf = 0; const t0 = performance.now();
    const tick = (t:number) => {
      const k = (t - t0)/400;
      letters.forEach((node,i) => {
        const y = Math.sin(k + i*1.2) * 5;
        const r = rotations[i];
        node.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotations]);

  return <SplitWord ref={ref} text={text} className={className}/>;
};

/* 9) Variable font study — weight/width on scroll (requires 'Fraunces') */
export const VariableWord: React.FC<{ text:string; progress:number; className?:string }>
= ({ text, progress, className="" }) => {
  const wght = 200 + progress*700; // 200 → 900
  const opsz = 36 + progress*36;   // optical size (if available)
  return <span className={className} style={{ fontFamily:'Fraunces, serif', fontVariationSettings:`"wght" ${wght}, "opsz" ${opsz}` }}>{text}</span>;
};

/* 10) Kerning playground — drag letters sideways */
type KerningOffsets = Record<number, number>;
const SNAP_STEP = 4;

const readKerningOffsets = (key: string): KerningOffsets => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const KerningPlay: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<KerningOffsets>(() => readKerningOffsets(`kerning:${text}`));
  const [history, setHistory] = useState<KerningOffsets[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [snap, setSnap] = useState(true);
  const storageKey = useMemo(() => `kerning:${text}`, [text]);
  const offsetsRef = useRef<KerningOffsets>(offsets);

  useEffect(() => {
    offsetsRef.current = offsets;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(offsets));
    }
  }, [offsets, storageKey]);

  useEffect(() => {
    setOffsets(readKerningOffsets(storageKey));
    setHistory([]);
  }, [storageKey]);

  const pushHistory = useCallback((snapshot: KerningOffsets) => {
    setHistory((h) => [...h.slice(-15), { ...snapshot }]);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (!prev) return h;
      setOffsets({ ...prev });
      return h.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    if (!Object.keys(offsetsRef.current).length) return;
    pushHistory(offsetsRef.current);
    setOffsets({});
  }, [pushHistory]);

  useEffect(() => {
    const host = wrapperRef.current;
    if (!host) return;
    let activeIndex = -1;
    let pointerId = -1;
    let startX = 0;
    let startValue = 0;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.dataset?.index) return;
      activeIndex = Number(target.dataset.index);
      pointerId = event.pointerId;
      startX = event.clientX;
      startValue = offsetsRef.current[activeIndex] ?? 0;
      pushHistory(offsetsRef.current);
      target.setPointerCapture(pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (activeIndex === -1) return;
      const raw = startValue + (event.clientX - startX);
      const snapped = snap && !event.altKey ? Math.round(raw / SNAP_STEP) * SNAP_STEP : raw;
      setOffsets((prev) => {
        if (prev[activeIndex] === snapped) return prev;
        return { ...prev, [activeIndex]: snapped };
      });
    };

    const endDrag = () => {
      if (activeIndex === -1) return;
      host.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.releasePointerCapture(pointerId);
      activeIndex = -1;
      pointerId = -1;
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setHoverIndex(target?.dataset?.index ? Number(target.dataset.index) : null);
    };

    const onPointerLeave = () => setHoverIndex(null);

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerover", onPointerOver);
    host.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerover", onPointerOver);
      host.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [pushHistory, snap]);

  const letters = useMemo(() => Array.from(text), [text]);
  const hasOffsets = Object.keys(offsets).length > 0;

  return (
    <div ref={wrapperRef} className={`relative rounded-2xl border border-neutral-200 bg-white/70 p-6 ${className}`}>
      <div className="relative inline-flex">
        {letters.map((char, index) => {
          const isActive = hoverIndex !== null && (hoverIndex === index || hoverIndex + 1 === index);
          return (
            <span
              key={index}
              data-index={index}
              className={`inline-block cursor-grab select-none text-[min(10vw,110px)] font-black leading-none ${isActive ? "text-amber-900" : ""}`}
              style={{
                marginRight: `${offsets[index] ?? 0}px`,
                background: isActive ? "rgba(251,191,36,0.25)" : undefined,
                borderRadius: isActive ? "6px" : undefined,
                transition: "background 120ms, color 120ms"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
        {hoverIndex !== null && hoverIndex < letters.length - 1 && (
          <GapMeter parentRef={wrapperRef} index={hoverIndex} offsets={offsets} />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
        <button onClick={undo} disabled={!history.length} className="rounded-lg border px-3 py-1.5 font-medium disabled:opacity-30">
          Undo
        </button>
        <button onClick={reset} disabled={!hasOffsets} className="rounded-lg border px-3 py-1.5 font-medium disabled:opacity-30">
          Reset
        </button>
        <label className="inline-flex items-center gap-2 text-neutral-500">
          <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} className="accent-amber-500" />
          Snap {SNAP_STEP}px
        </label>
        <span className="ml-auto text-xs text-neutral-400">Hold ⌥ while dragging to freehand.</span>
      </div>
    </div>
  );
};

const GapMeter: React.FC<{ parentRef: React.RefObject<HTMLDivElement>; index: number; offsets: KerningOffsets }> = ({ parentRef, index, offsets }) => {
  const [metrics, setMetrics] = useState({ gap: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    const host = parentRef.current;
    if (!host) return;
    const left = host.querySelector<HTMLElement>(`[data-index="${index}"]`);
    const right = host.querySelector<HTMLElement>(`[data-index="${index + 1}"]`);
    if (!left || !right) return;
    const hostBox = host.getBoundingClientRect();
    const a = left.getBoundingClientRect();
    const b = right.getBoundingClientRect();
    setMetrics({
      gap: b.left - a.right,
      left: a.right - hostBox.left,
      width: Math.max(b.left - a.right, 32)
    });
  }, [parentRef, index, offsets]);

  const verdict = metrics.gap < 0 ? "too tight" : metrics.gap > 28 ? "too loose" : "balanced";

  return (
    <div className="pointer-events-none absolute -bottom-9 text-[11px]" style={{ left: metrics.left, width: metrics.width }}>
      <div className="flex items-center justify-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-white">
        <span>{Math.round(metrics.gap)}px</span>
        <span className="uppercase tracking-wide opacity-70">{verdict}</span>
      </div>
    </div>
  );
};
