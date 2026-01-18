import React, { useEffect, useLayoutEffect, useMemo, useRef, forwardRef } from "react";

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

/* 1) BROKEN — hinge and fall based on scroll progress */
export const BrokenWord: React.FC<{ text:string; pivotIndex:number; progress: number; className?:string }> = ({ text, pivotIndex, progress, className="" }) => {
  const p = Math.max(0, Math.min(1, progress * 2)); // Animate over first half of scroll
  return (
    <SplitWord text={text} className={className} map={(i)=> {
      if(i < pivotIndex) return {};
      if(i === pivotIndex) return { transform:`rotate(${p * 28}deg)`, transformOrigin:"0% 50%" };
      const n = i - pivotIndex;
      const tx = p * (n * 10 + 5);
      const ty = p * p * (n * 35);
      const rot = p * (90 - n * 5);
      return { 
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, 
        transformOrigin:"0% 0%",
        opacity: 1 - p * 0.3
      };
    }}/>
  );
};

/* 2) MISSING — keep rhythm, remove glyph */
export const MissingLetterWord: React.FC<{ text:string; targetIndex:number; keepSpace?:boolean; className?:string }>
= ({ text, targetIndex, keepSpace=true, className="" }) => (
  <SplitWord text={text} className={className} map={(i)=> i!==targetIndex ? {} :
    keepSpace ? { color:"transparent", opacity:.1 } : { width:"0.5ch", display:"inline-block" } }/>
);

/* 3) VIBRATE — ghost layers + micro-jitter */
export const VibrateWord: React.FC<{ text:string; strength?:number; className?:string }>
= ({ text, strength=2.5, className="" }) => (
  <span className={`relative inline-block will-change-transform ${className}`} style={{ filter:"contrast(110%)" }}>
    <span aria-hidden className="absolute inset-0" style={{ color:"rgba(0,0,0,.25)", transform:`translate(${strength}px,0)` }}>{text}</span>
    <span aria-hidden className="absolute inset-0" style={{ color:"rgba(0,0,0,.18)", transform:`translate(${-strength}px,0)` }}>{text}</span>
    <span aria-hidden className="absolute inset-0" style={{ color:"rgba(0,0,0,.10)", transform:`translate(0,${strength}px)` }}>{text}</span>
    <span className="relative animate-[jitter_60ms_infinite_alternate]">{text}</span>
  </span>
);

/* 4) SQUISH — squash & stretch with eased scroll progress */
export const SquishWord: React.FC<{ text:string; progress:number; max?:number; className?:string }>
= ({ text, progress, max=.5, className="" }) => {
  // Use a sine wave to make it squish in the middle of the viewport passage
  const easedProgress = Math.sin(progress * Math.PI);
  const amt = easedProgress * max;
  return <span className={`inline-block origin-center will-change-transform ${className}`}
               style={{ transform:`scale(${1+amt}, ${1-amt})` }}>{text}</span>;
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
export const KerningPlay: React.FC<{ text:string; className?:string }> = ({ text, className="" }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!; let active: HTMLSpanElement | null = null; let sx = 0; let base = 0;
    const down = (e:PointerEvent)=> {
      const t = e.target as HTMLElement;
      if(!t || t.dataset.letter===undefined) return;
      active = t.closest('[data-letter]');
      if (!active) return;
      sx = e.clientX; 
      base = parseFloat(active.style.marginRight || "0"); 
      t.setPointerCapture(e.pointerId);
      active.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };
    const move = (e:PointerEvent)=> { if(!active) return; active.style.marginRight = `${base + (e.clientX - sx)}px`; };
    const up = (e: PointerEvent)=> {
        if (active) {
            active.style.cursor = '';
            active.releasePointerCapture(e.pointerId);
        }
        active = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };
    el.addEventListener("pointerdown", down); 
    el.addEventListener("pointermove", move); 
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return ()=>{ 
        el.removeEventListener("pointerdown", down); 
        el.removeEventListener("pointermove", move); 
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
    };
  }, []);
  return (
    <div ref={ref} className={`border border-neutral-200 p-6 rounded-xl bg-white/60 touch-none ${className}`}>
      <SplitWord text={text} className="text-[min(10vw,100px)] font-black cursor-grab select-none" map={()=>({ marginRight:"0.1ch" })}/>
      <p className="mt-4 text-neutral-500 text-sm">Drag letters to adjust pair spacing. (Reset on refresh)</p>
    </div>
  );
};
