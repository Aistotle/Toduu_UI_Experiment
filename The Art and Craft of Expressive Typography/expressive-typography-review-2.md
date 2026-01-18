
# Expressive Typography — Polish Plan, Part 2 (v2.2)

Purpose: push the *remaining* sections into true expressive craft.  
Format: each task is self‑contained and tagged so you can assign one or many to Codex.

Stack: **Vite + React 19 + TypeScript + Tailwind (CDN)**, no heavy motion libs. Keep `Chapter` pattern where `content={(progress)=> ...}` exposes a section progress `0..1`. Respect `prefers-reduced-motion`.

> Use the tags (e.g. `[CV-1]`) in commit messages and when instructing Codex.


---

## Index

- [CV-1] Connected Voice — **loop** (stroke-through letters, real masking + draw-on)
- [PL-2] Play — **HAPPY** (smile baseline + springy tilt)
- [CR-1] Craft — **Kerning Playground Pro** (pair highlights, snap, reset/undo)
- [SE-1] Scale as Emphasis — sentence with **biggest**
- [WT-1] Weight & Texture — sentence (whisper/shout/light/heavy)
- [ST-1] Spacing & Tension — **RELEASE** (center-out expansion with micro-bounce)
- [TV-1] Typeface as Voice — pangram (multi-voice crossfade + slider)
- [FN-1] Finale — orchestrated paragraph (timed cues + token choreography)
- [GS-2] Global helpers & perf (intersection guards, easing, text-balance)

---

## [CV-1] Connected Voice — loop

**What’s off now**  
- The “connector” floats over the word like a detached halo instead of threading *through* the glyphs.  
- Because there is no masking/occlusion, we never believe it is the same stroke that created the letters.  
- The line weight is uniform and ignores the counters (double “o”), so the path misses the moment of weaving.  
- There is no reveal, no easing, and no reduced-motion respect; the idea never matches the chapter progress.

**Experience goals**  
- Read as one confident pen stroke whose pressure kisses every glyph before lifting.  
- Glide through the counters of the two “o”s, brush the ascender of the “l”, and tuck back into the descender of the “p”.  
- Borrow color from the parent text color, but add a subtle gradient + glow so the stroke feels alive even when static.

**Make it excellent**  
- **Shared geometry.** Render letters + connector in the same SVG viewport so the bezier path can sit precisely inside the glyphs. Use `useId()` so each instance owns its mask/gradient IDs.  
- **Stroke craft.** Keep a master `PATH` constant shaped for “loop”, then feel free to swap control points when the copy changes. Use two passes of the path: one blurred for glow, one crisp core stroke.  
- **Motion.** Drive `stroke-dasharray/offset` with eased chapter progress (clamp to 0‒1, ease-out cubic). The dash offset must update inside `useLayoutEffect` so reversing scroll feels snappy.  
- **Accessibility + tuning.** Respect `prefers-reduced-motion` by skipping the dash animation. Emit an `sr-only` copy of the word, and ensure the SVG scales with `em` so type size stays in lockstep with the surrounding heading.

**Code (new component)** `ConnectedVoice.tsx`
```tsx
// src/components/ConnectedVoice.tsx  // [CV-1]
import React, { useId, useLayoutEffect, useMemo, useRef } from "react";

type ConnectedVoiceProps = {
  text?: string;
  progress?: number;
  className?: string;
  accent?: string;
  strokeWidth?: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const PATH = "M 90 345 C 210 110, 390 110, 500 320 S 770 560, 900 320";

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return prefers;
};

export const ConnectedVoice: React.FC<ConnectedVoiceProps> = ({
  text = "loop",
  progress = 1,
  className = "",
  accent = "hsl(14 92% 60%)",
  strokeWidth = 62,
}) => {
  const maskId = useId();
  const gradientId = useId();
  const glowId = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const easedProgress = useMemo(
    () => (prefersReduced ? 1 : easeOut(clamp(progress))),
    [progress, prefersReduced]
  );

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${(1 - easedProgress) * length}`;
  }, [easedProgress]);

  return (
    <span className={`inline-block leading-none ${className}`} aria-label={text}>
      <svg
        viewBox="0 0 1000 600"
        width="1em"
        height="0.58em"
        className="align-middle"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <mask id={`${maskId}-letters`}>
            <rect width="1000" height="600" fill="black" />
            <text
              x="500"
              y="415"
              textAnchor="middle"
              fontFamily="Inter, system-ui"
              fontWeight="900"
              fontSize="520"
              letterSpacing="-18"
              fill="white"
            >
              {text}
            </text>
          </mask>

          <linearGradient id={`${gradientId}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.75" />
            <stop offset="45%" stopColor={accent} />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>

          <filter id={`${glowId}-glow`} filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text
          x="500"
          y="415"
          textAnchor="middle"
          fontFamily="Inter, system-ui"
          fontWeight="900"
          fontSize="520"
          letterSpacing="-18"
          fill="currentColor"
        >
          {text}
        </text>

        <g mask={`url(#${maskId}-letters)`}>
          <path
            d={PATH}
            stroke={`url(#${gradientId}-stroke)`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
            filter={`url(#${glowId}-glow)`}
          />
          <path
            ref={pathRef}
            d={PATH}
            stroke={`url(#${gradientId}-stroke)`}
            strokeWidth={strokeWidth * 0.92}
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <path
          d={PATH}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
      </svg>
      <span className="sr-only">{text}</span>
    </span>
  );
};
```
**Usage in chapter**
```tsx
<Chapter
  title="Connected Voice"
  explanation="Imply a single continuous stroke across forms."
  content={(progress)=>(
    <div className="text-[min(14vw,140px)] font-black text-slate-900">
      <ConnectedVoice progress={progress} accent="hsl(18 93% 62%)" />
    </div>
  )}
/>
```

**Acceptance**  
- The stroke is only visible where it overlaps the glyphs, while a faint glow hints at ink beyond the forms.  
- `progress=0` hides the stroke, `progress=1` shows a complete loop, and reversing scroll scrubs the draw with eased timing.  
- The bezier kisses the ascender/descender and passes through both counters so it truly feels like a single motion.  
- With `prefers-reduced-motion: reduce`, the component renders the fully drawn stroke immediately (no dash animation) but still honors the mask/glow.

---

## [PL-2] Play — HAPPY

**What’s off now**  
- The wobble is random noise; it never reads as a deliberate smile curve.  
- Pointer/motion doesn’t influence the word, so it feels flat and unaware of the user.  
- Motion kicks in instantly (no easing) and there’s no reduced-motion fallback, so it can jitter or fail accessibility.

**Make it excellent**  
- Derive the baseline from a deterministic **smile curve** (e.g., sin across the word). Scale the arc by container width (≈10–18px) so the grin always feels proportional.  
- Drive a **springy tilt** from pointer X on desktop and `deviceorientation` gamma on mobile. Ease toward the target so letters glide instead of snapping; weight rotation by distance from the center so outer letters lean more.  
- Clamp rotation (±12°) and translate only a few pixels so the word stays legible. When the pointer leaves or the tab blurs, ease back to the neutral smile.  
- Respect `prefers-reduced-motion`: render the static smile and remove listeners, but re-enable motion if the preference flips at runtime.

**Code (replace HappyWord)**  
```tsx
// in TypeStudies.tsx  // [PL-2]
export const HappyWord: React.FC<{ text?: string; className?: string }>
= ({ text = "HAPPY", className = "" }) => {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = ref.current;
    if (!root) return;
    const letters = root.querySelectorAll<HTMLSpanElement>("[data-letter]");
    if (!letters.length) return;

    const applyTransforms = (focus: number) => {
      const arc = Math.min(18, Math.max(10, root.clientWidth * 0.03 || 12));
      const tiltRange = 12; // max degrees for outer letters
      const normalizedFocus = Math.min(1, Math.max(0, focus));
      const pull = (normalizedFocus - 0.5) * 2; // -1..1
      const denom = Math.max(letters.length - 1, 1);

      letters.forEach((node, index) => {
        const t = letters.length === 1 ? 0.5 : index / denom; // 0..1
        const smile = Math.sin((t - 0.5) * Math.PI) * arc;
        const leanWeight = (t - 0.5) * tiltRange;
        const lean = leanWeight * pull;
        node.style.transformOrigin = `${t * 100}% 80%`;
        node.style.transform = `translateY(${smile}px) rotate(${lean}deg)`;
      });
    };

    const enableStatic = () => applyTransforms(0.5);

    const setupMotion = () => {
      let target = 0.5;
      let rendered = 0.5;
      let raf = 0;
      const clamp = (value: number) => Math.min(1, Math.max(0, value));

      const animate = () => {
        rendered += (target - rendered) * 0.16; // springy easing
        applyTransforms(rendered);
        if (Math.abs(target - rendered) > 0.002) {
          raf = window.requestAnimationFrame(animate);
        } else {
          raf = 0;
        }
      };
      const queue = () => { if (!raf) raf = window.requestAnimationFrame(animate); };

      const pointerToRatio = (clientX: number) => {
        const rect = root.getBoundingClientRect();
        if (!rect.width) return 0.5;
        return clamp((clientX - rect.left) / rect.width);
      };

      const handlePointerMove = (event: PointerEvent) => {
        target = pointerToRatio(event.clientX);
        queue();
      };
      const reset = () => { target = 0.5; queue(); };
      const handleTilt = (event: DeviceOrientationEvent) => {
        if (typeof event.gamma !== "number") return;
        const gamma = Math.max(-30, Math.min(30, event.gamma));
        target = clamp(0.5 + gamma / 60);
        queue();
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      window.addEventListener("deviceorientation", handleTilt);

      queue();

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
        window.removeEventListener("deviceorientation", handleTilt);
      };
    };

    let teardownMotion: (() => void) | null = null;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const applyPref = (reduce: boolean) => {
      teardownMotion?.();
      teardownMotion = null;
      if (reduce) {
        enableStatic();
        return;
      }
      teardownMotion = setupMotion();
    };

    applyPref(mq?.matches ?? false);

    const handlePrefChange = (event: MediaQueryListEvent) => applyPref(event.matches);
    if (mq) {
      if (typeof mq.addEventListener === "function") mq.addEventListener("change", handlePrefChange);
      else if (typeof mq.addListener === "function") mq.addListener(handlePrefChange);
    }

    return () => {
      teardownMotion?.();
      if (mq) {
        if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", handlePrefChange);
        else if (typeof mq.removeListener === "function") mq.removeListener(handlePrefChange);
      }
    };
  }, [text]);

  return (
    <SplitWord
      ref={ref as any}
      text={text}
      className={`inline-flex select-none text-[min(12vw,140px)] font-black tracking-tight ${className}`}
    />
  );
};
```

**Acceptance**  
- Static state is a balanced smile curve (no random jitter) with letters easing toward the center.  
- Pointer or device tilt nudges the word with a springy, clamped lean; it always settles back when input stops.  
- `prefers-reduced-motion` collapses to the static smile yet resumes motion if the user toggles the system setting.

---

## [CR-1] Craft — Kerning Playground Pro

**What’s off now**  
- The drag interaction lacks **context**—no pair highlight, no distance readout, and no way to recover the original spacing.  
- Kerning jumps feel mushy because there’s no **snap** or history; comparing states requires a page refresh.  
- Offsets disappear on reload, so experimentation feels risky instead of playful.

**Make it excellent**  
- Illuminate the active pair with a warm highlight plus an inline gap meter that labels the spacing (tight / balanced / loose).  
- Introduce a 4 px snap grid (with a bypass modifier) so designers can feel the rhythm while still allowing freehand nudges.  
- Ship Undo + Reset controls and persist offsets per phrase in `localStorage`.

**Code (upgrade)**  
```tsx
// src/TypeStudies.tsx  // [CR-1] Kerning Playground Pro
import React from "react";

type OffsetMap = Record<number, number>;
const SNAP_STEP = 4;

const readOffsets = (key: string): OffsetMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const KerningPlay: React.FC<{ text: string; className?: string }>
= ({ text, className = "" }) => {
  const [offsets, setOffsets] = React.useState<OffsetMap>(() => readOffsets(`kerning:${text}`));
  const storageKey = React.useMemo(() => `kerning:${text}`, [text]);
  const [history, setHistory] = React.useState<OffsetMap[]>([]);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [snap, setSnap] = React.useState(true);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const offsetsRef = React.useRef(offsets);

  React.useEffect(() => {
    offsetsRef.current = offsets;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(offsets));
    }
  }, [offsets, storageKey]);

  React.useEffect(() => {
    setOffsets(readOffsets(storageKey));
    setHistory([]);
  }, [storageKey]);

  const pushHistory = React.useCallback((snapshot: OffsetMap) => {
    setHistory(h => [...h.slice(-15), { ...snapshot }]);
  }, []);

  const undo = React.useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1];
      if (!prev) return h;
      setOffsets({ ...prev });
      return h.slice(0, -1);
    });
  }, []);

  const reset = React.useCallback(() => {
    if (!Object.keys(offsetsRef.current).length) return;
    pushHistory(offsetsRef.current);
    setOffsets({});
  }, [pushHistory]);

  React.useEffect(() => {
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
      const next = snap && !event.altKey ? Math.round(raw / SNAP_STEP) * SNAP_STEP : raw;
      setOffsets(prev => {
        if (prev[activeIndex] === next) return prev;
        return { ...prev, [activeIndex]: next };
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

  const letters = React.useMemo(() => Array.from(text), [text]);
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
              {char}
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
          <input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} className="accent-amber-500" />
          Snap {SNAP_STEP}px
        </label>
        <span className="ml-auto text-xs text-neutral-400">Hold ⌥ while dragging to freehand.</span>
      </div>
    </div>
  );
};

const GapMeter: React.FC<{ parentRef: React.RefObject<HTMLDivElement>; index: number; offsets: OffsetMap }>
= ({ parentRef, index, offsets }) => {
  const [metrics, setMetrics] = React.useState({ gap: 0, left: 0, width: 0 });

  React.useLayoutEffect(() => {
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
```

**Acceptance**  
- Hovering or dragging clearly highlights the active pair and surfaces the live px gap plus a verdict (tight / balanced / loose).  
- Snap-on-by-default keeps adjustments in 4 px steps, ⌥ temporarily frees the pointer, and Undo / Reset never lose work.  
- Offsets persist per phrase, and dragging stays smooth at 60 fps.

---

## [SE-1] Scale as Emphasis — sentence with “biggest”

**What’s off now**  
- “biggest” just slams larger with a single `scale()` so it collides with neighbors, clips inside the line box, and still sits on the baseline.  
- The rest of the sentence stays rigid; there’s no breathing room or rhythm change so hierarchy reads like a rendering bug instead of intent.  
- There’s no timed moment (pop ➝ hold ➝ settle) or reduced-motion strategy, so the emphasis feels abrupt and inaccessible.

**Make it excellent**  
- Tokenize the sentence, then stage the move: let the non-target words exhale (word-spacing + slight drop + fade), pop “biggest” up with an exaggerated scale, then settle to an elevated but readable size.  
- Expand tracking and add a subtle radial halo/blur at peak so the extra scale feels like a spotlight, not overflow.  
- Keep overflow visible, manage punctuation safely, and clamp progress to `1` when `prefers-reduced-motion` requests no animation.

**Code (new component)** `ScaleSentence.tsx`
```tsx
// src/components/ScaleSentence.tsx  // [SE-1]
import React from "react";
import { clamp01 } from "../utils/ease";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type Props = {
  text: string;
  target?: string;
  progress?: number;
  className?: string;
};

export const ScaleSentence: React.FC<Props> = ({
  text,
  target = "biggest",
  progress = 0,
  className = "",
}) => {
  const tokens = React.useMemo(() => text.split(/(\s+)/), [text]);
  const t = clamp01(progress);
  const grow = easeOutExpo(Math.min(t, 0.72) / 0.72);
  const settle = easeInOutQuad(t <= 0.72 ? 0 : (t - 0.72) / 0.28);
  const release = clamp01((t - 0.9) / 0.1);
  const wordSpacing = lerp(0, 0.22, grow) - lerp(0, 0.12, settle);
  const halo = clamp01(lerp(0, 1, grow) - lerp(0, 0.85, settle));

  return (
    <p
      className={`relative leading-[1.02] ${className}`}
      style={{ wordSpacing: `${wordSpacing}em`, textWrap: "balance" as any, overflow: "visible" }}
    >
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <React.Fragment key={`space-${i}`}>{token}</React.Fragment>;
        const clean = token.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        const isTarget = clean === target.toLowerCase();

        if (!isTarget) {
          const fade = 1 - grow * 0.55 + settle * 0.25;
          const drift = lerp(0, 4, grow) - lerp(0, 2, settle);
          const tighten = lerp(0, 0.08, grow) - lerp(0, 0.05, settle);
          return (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: fade,
                transform: `translateY(${drift}px) scale(${1 - grow * 0.04})`,
                letterSpacing: `${tighten}em`,
              }}
            >
              {token}
            </span>
          );
        }

        const scale = 1 + grow * 1.6 - settle * 0.9 - release * 0.1;
        const lift = lerp(0, -12, grow) + lerp(0, 6, settle);
        const targetTrack = lerp(-0.02, 0.14, grow) - lerp(0, 0.08, settle);
        const blur = 8 + halo * 16;

        return (
          <span
            key={i}
            className="relative inline-block origin-bottom"
            style={{
              transform: `translateY(${lift}px) scale(${scale})`,
              letterSpacing: `${targetTrack}em`,
              padding: "0 0.05em",
            }}
          >
            <span className="relative z-[1]">{token}</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-[1] rounded-full"
              style={{
                background: `radial-gradient(circle, currentColor ${Math.max(14, halo * 60)}%, transparent 80%)`,
                opacity: 0.2 + halo * 0.4,
                filter: `blur(${blur}px)`,
              }}
            />
          </span>
        );
      })}
    </p>
  );
};
```
**Usage**  
```tsx
const reduceMotion = usePrefersReducedMotion(); // simple hook around matchMedia("(prefers-reduced-motion: reduce)")

<Chapter
  title="Scale as Emphasis"
  explanation="Size creates hierarchy. The biggest thing wins attention."
  content={(p)=>(
    <ScaleSentence
      className="text-[clamp(28px,5vw,64px)] font-light"
      text="Sometimes, the loudest voice in the room is simply the biggest."
      target="biggest"
      progress={reduceMotion ? 1 : p}
    />
  )}
/>
```

**Acceptance**  
- “biggest” runs through a pop ➝ halo ➝ settle arc, ending about 1.5–1.6× larger without clipping or baseline jumps.  
- Neighbor words exhale (spacing + fade + dip) so the hierarchy feels intentional on every viewport width.  
- When reduced motion is requested, the sentence renders directly in the final emphasised state (no tweening).

---

## [WT-1] Weight & Texture — sentence

**What’s off now**  
- Progress sweeps every word at once, so there’s no **beat-by-beat contrast**; “texture” still reads like a single weight slider.  
- The sensory metaphors aren’t embodied: “whisper” doesn’t thin out, “light as air” doesn’t float, and “heavy as stone” lacks gravity or grit.  
- Reduced-motion patrons still see an in-progress tween because the component assumes motion is always allowed.

**Make it excellent**  
- Stage the animation across four **acts** tied to `progress`: whisper → shout → light-as-air → heavy-as-stone. Each act only touches its word, leaving the rest as visual ballast.  
- Swap typefaces/axes to reinforce tone: Fraunces (optical axis) for the whisper/light beats, Space Grotesk for the shout/heavy punch. Layer spacing, blur, and color to make whisper airy and shout compressed + loud.  
- Give “light as breath” literal lift (upward drift + glow) and wrap “heavy as stone” in a separate span that adds compression, drop-shadow weight, and an overlaid noise patch for toothy contrast.  
- Clamp to the final state for `prefers-reduced-motion` but still react if the preference flips while the chapter is on screen.

**Code (replace `TextureSentence`)** `TextureSentence.tsx`
```tsx
// src/components/TextureSentence.tsx  // [WT-1]
import React, { useEffect, useState } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (x: number) => x * x * (3 - 2 * x);
const segment = (value: number, start: number, end: number) =>
  smoothstep(clamp01((value - start) / Math.max(0.0001, end - start)));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const usePrefersReducedMotion = () => {
  const getPref = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [prefers, setPrefers] = useState<boolean>(getPref);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = (event: MediaQueryListEvent) => setPrefers(event.matches);
    setPrefers(mq.matches);
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  return prefers;
};

type TextureSentenceProps = { progress?: number; className?: string };

export const TextureSentence: React.FC<TextureSentenceProps> = ({ progress = 0, className = "" }) => {
  const prefersReduced = usePrefersReducedMotion();
  const t = prefersReduced ? 1 : clamp01(progress);

  const whisper = segment(t, 0, 0.28);
  const shout = segment(t, 0.18, 0.6);
  const light = segment(t, 0.45, 0.82);
  const heavy = segment(t, 0.65, 1);

  const heavyNoise = 0.18 + heavy * 0.45;

  return (
    <p
      className={`relative max-w-[58ch] text-[clamp(28px,5vw,64px)] leading-tight tracking-tight ${className}`}
      style={{ textWrap: "balance" as any }}
    >
      Weight behaves like texture—it can{" "}
      <span
        className="inline-flex"
        style={{
          fontFamily: '"Fraunces", "Cormorant Garamond", serif',
          fontVariationSettings: `"wght" ${mix(420, 160, whisper)}`,
          letterSpacing: `${mix(-0.01, 0.2, whisper)}em`,
          color: `hsl(210 70% ${mix(58, 82, whisper)}%)`,
          opacity: 0.65 + whisper * 0.3,
          filter: `blur(${mix(0, 0.45, whisper)}px)`,
          transform: `translateY(${mix(0, -2, whisper)}px)`
        }}
      >
        whisper
      </span>
      , then{" "}
      <span
        className="inline-flex uppercase font-black"
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
          letterSpacing: `${mix(-0.01, -0.08, shout)}em`,
          fontVariationSettings: `"wght" ${mix(580, 980, shout)}`,
          transform: `translateY(${mix(0, -8, shout)}px) scale(${mix(1, 1.12, shout)})`,
          color: `hsl(14 90% ${mix(46, 62, shout)}%)`,
          textShadow: `0 ${mix(0, 12, shout)}px ${mix(0, 28, shout)}px rgba(40,3,0,${0.2 + shout * 0.45})`
        }}
      >
        shout
      </span>
      . It can feel{" "}
      <span
        className="inline-flex relative"
        style={{
          fontFamily: '"Fraunces", "Cormorant Garamond", serif',
          fontVariationSettings: `"wght" ${mix(460, 260, light)}`,
          letterSpacing: `${mix(0, 0.14, light)}em`,
          color: `hsl(48 100% ${mix(88, 98, light)}% / ${mix(0.65, 1, light)})`,
          filter: `drop-shadow(0 ${mix(10, 4, light)}px ${mix(20, 8, light)}px rgba(255,255,255,0.7)) blur(${mix(3, 0, light)}px)`,
          transform: `translateY(${mix(18, 0, light)}px)`
        }}
      >
        light as breath
      </span>
      {" "}or land{" "}
      <span className="relative inline-flex items-center px-0.5">
        <span
          style={{
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
            fontVariationSettings: `"wght" ${mix(600, 1000, heavy)}`,
            letterSpacing: `${mix(0, -0.12, heavy)}em`,
            color: `hsl(214 16% ${mix(32, 10, heavy)}%)`,
            transform: `translateY(${mix(0, 12, heavy)}px) scaleX(${mix(1, 0.94, heavy)})`,
            textShadow: `0 ${mix(0, 18, heavy)}px ${mix(2, 36, heavy)}px rgba(5,5,5,${0.15 + heavy * 0.45})`,
            filter: `saturate(${mix(100, 72, heavy)}%) contrast(${mix(100, 138, heavy)}%)`
          }}
        >
          heavy as stone
        </span>
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            opacity: heavyNoise,
            backgroundImage:
              "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(0,0,0,0.4), transparent 48%)",
            filter: "blur(0.6px)"
          }}
        />
      </span>
      .
      {prefersReduced && <span className="sr-only">Motion is reduced; showing the final texture state.</span>}
    </p>
  );
};
```

**Usage**  
```tsx
<Chapter
  title="Weight & Texture"
  explanation="Texture shifts meaning: let the sentence whisper, shout, float, then land."
  content={(p)=>(
    <TextureSentence
      progress={p}
      className="mx-auto"
    />
  )}
/>

**Acceptance**  
- Progress feels choreographed: whisper enters first, then shout, then light, then heavy, with the rest of the sentence acting as visual ballast.  
- “Heavy as stone” compresses, drops a shadow, and shows a subtle grain patch without ever crushing the baseline or becoming illegible.  
- `prefers-reduced-motion` locks to the final layout immediately yet resumes animation when the preference flips mid-session.  
- Text stays within ~58 ch on desktop and never clips on mobile breakpoints.

---

## [ST-1] Spacing & Tension — RELEASE

**What’s off now**  
- The current treatment just increases tracking uniformly, so nothing feels like it’s *breaking free*.  
- The center of the word never leads—the whole word drifts apart at once, which kills the tension→release payoff.  
- Without easing or overshoot the motion reads mechanical, and reduced-motion users get a jarring jump cut.

**Experience goals**  
- Start with a dense knot around the two central “E”s, then let the middle pop first and drag the outer letters along.  
- Hear/feel a *micro recoil* when the word hits full width, like elastic finally relaxing.  
- Keep letters on the baseline and perfectly legible even when the spacing is extreme.  
- Provide a mid-open still for reduced-motion users so they still read “release” as an idea, not an accident.

**Make it excellent**  
- Split the word into spans (via `SplitWord`) and compute offsets relative to the center index so each letter has its own travel curve. Pair mirrored letters to keep the motion symmetrical.  
- Drive motion with an eased clamp (e.g., `easeOutCubic`) and layer a late-stage bounce (only once progress > 0.85) so the final position breathes.  
- Slightly scale or lighten the center letters while compressed so the audience senses stored energy before the release.  
- Respect `prefers-reduced-motion`: skip the dashy micro-bounce, land in a 70 % open pose, but keep the same spatial logic so screenshots still convey the idea.

**Code (new component)** `ReleaseWord.tsx`
```tsx
// src/components/ReleaseWord.tsx  // [ST-1]
import React, { useMemo } from "react";
import { SplitWord } from "./TypeStudies";
import { easeOutCubic } from "../utils/ease";

type ReleaseWordProps = {
  text?: string;
  progress?: number;
  className?: string;
  maxSpread?: number;
  bounce?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return prefers;
};

export const ReleaseWord: React.FC<ReleaseWordProps> = ({
  text = "RELEASE",
  progress = 0,
  className = "",
  maxSpread = 42,
  bounce = 0.08,
}) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const center = (letters.length - 1) / 2;
  const prefersReduced = usePrefersReducedMotion();

  const eased = useMemo(() => {
    if (prefersReduced) return 0.7; // mid-open still
    return easeOutCubic(clamp01(progress));
  }, [progress, prefersReduced]);

  const bouncePhase = prefersReduced ? 0 : clamp01((eased - 0.85) / 0.15);
  const release = eased + Math.sin(bouncePhase * Math.PI) * bounce;

  return (
    <SplitWord
      text={text}
      className={`inline-flex font-black leading-none tracking-tight ${className}`}
      map={(index) => {
        const dist = index - center;
        const direction = dist === 0 ? 0 : Math.sign(dist);
        const normalized = center === 0 ? 0 : Math.abs(dist) / center;
        const travel = direction * normalized * maxSpread * release;
        const tensionScale = 1 - normalized * 0.08 * (1 - release);

        return {
          transform: `translateX(${travel.toFixed(2)}px) scale(${tensionScale.toFixed(3)})`,
          transitionTimingFunction: "cubic-bezier(.18,1,.4,1)",
        };
      }}
    />
  );
};
```
**Usage**  
```tsx
<Chapter title="Spacing and Tension" explanation="Tight builds tension. Release creates calm."
  content={(p)=>(<div className="text-[min(18vw,180px)]"><ReleaseWord progress={p}/></div>)}
/>
```

**Acceptance**  
- Progress 0 keeps the word compressed around the center letters; progress 1 lands in a wide, calm stance with a barely perceptible recoil.  
- Motion is perfectly mirrored left/right, and the center pair clearly leads the release.  
- Users with `prefers-reduced-motion` see the mid-release pose (≈70 % open) with no bounce, but color/weight stay identical.  
- No matter the progress, the word stays horizontally centered and never overlaps neighboring UI.

---

## [TV-1] Typeface as Voice — pangram

**What’s off now**  
- Swapping full paragraphs per face causes a reflow jump; the reader has to re-find the sentence each time.  
- There’s no way to *hear the blend* between neighboring voices—just hard cuts.  
- The UI offers zero agency: progress drives everything, so users can’t linger on a voice they love.  
- Reduced-motion users still get abrupt face swaps because we never gate the transition duration.

**Experience goals**  
- Treat the pangram like a mixing board: glide smoothly between voices while keeping the baseline rock-solid.  
- Surface each voice’s label and tone descriptor right on top of the text so users understand the vibe at a glance.  
- Allow readers to take over with a slider, but fall back to auto progress when they release control.  
- Respect `prefers-reduced-motion` by crossfading instantly (no shimmer) while still honoring the slider value.

**Make it excellent**  
- Overlay every voice in the same grid cell; use opacity and subtle vertical lift to indicate which layer leads the duet.  
- Keep a shared layout box: identical tracking, width clamp, and line-height prevent measurable reflow.  
- Build a dual-source control value: `manual` (from the slider) wins while the pointer is down; otherwise `progress` drives the mix.  
- Pair the slider with live labels (active voice + descriptor) and a quick “Auto” reset button so collaboration feels intentional.

**Code (new component)** `VoicePangram.tsx`
```tsx
// src/components/VoicePangram.tsx  // [TV-1]
import React from "react";
import { clamp01 } from "../utils/ease";

type Voice = {
  id: string;
  name: string;
  tone: string;
  style: React.CSSProperties;
  className?: string;
};

const voices: Voice[] = [
  { id: "modern", name: "Modern Sans", tone: "crisp & editorial", style: { fontFamily: "Inter, system-ui", fontWeight: 500 } },
  { id: "elegant", name: "Elegant Serif", tone: "romantic & lyrical", style: { fontFamily: "Playfair Display, serif", fontWeight: 500 } },
  { id: "expressive", name: "Expressive Contrast", tone: "buttery & bold", style: { fontFamily: "Fraunces, serif", fontVariationSettings: `"wght" 640, "opsz" 60` } },
  { id: "mono", name: "Technical Mono", tone: "precise & cool", style: { fontFamily: "'Roboto Mono', monospace", fontWeight: 500 } },
];

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return prefers;
};

export const VoicePangram: React.FC<{ progress?: number; className?: string; text?: string }> = ({
  progress = 0,
  className = "",
  text = "The quick brown fox jumps over the lazy dog.",
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [manual, setManual] = React.useState<number | null>(null);
  const [isInteracting, setIsInteracting] = React.useState(false);

  const driver = clamp01(manual ?? progress);
  const scaled = driver * (voices.length - 1);
  const base = Math.floor(scaled);
  const upper = Math.min(voices.length - 1, base + 1);
  const blend = scaled - base;

  const activeIndex = blend > 0.5 ? upper : base;
  const activeVoice = voices[activeIndex];

  const transition = prefersReduced ? "opacity 80ms linear" : "opacity 260ms ease, transform 260ms ease";

  const handleChange = (value: number) => {
    setManual(value);
  };

  const releaseControl = () => {
    setIsInteracting(false);
    setManual(null);
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="relative grid" style={{ gridTemplateAreas: "'stack'", placeItems: "center" }} aria-live="polite">
        <div className="col-start-1 row-start-1 text-center max-w-[28ch]">
          {voices.map((voice, index) => {
            const opacity = index === base ? 1 - blend : index === upper ? blend : 0;
            const lift = prefersReduced ? 0 : (index === activeIndex ? -6 : 0);
            return (
              <p
                key={voice.id}
                aria-hidden={index !== activeIndex}
                style={{
                  ...voice.style,
                  opacity,
                  transform: `translateY(${lift}px)`,
                  transition,
                }}
                className="text-[clamp(28px,5vw,64px)] leading-tight tracking-tight absolute inset-0"
              >
                {text}
              </p>
            );
          })}
        </div>
        <div className="col-start-1 row-start-1 pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur">
            <span>{activeVoice.name}</span>
            <span className="normal-case tracking-normal opacity-70">{activeVoice.tone}</span>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-slate-500">
        VOICE
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={driver}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={releaseControl}
          onPointerLeave={() => isInteracting && releaseControl()}
          aria-valuetext={`${activeVoice.name} — ${activeVoice.tone}`}
          className="flex-1 accent-slate-900 [--track-height:6px]"
        />
        <button
          type="button"
          onClick={() => {
            setManual(null);
            setIsInteracting(false);
          }}
          className="rounded-full border border-slate-300 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
          aria-pressed={manual === null}
        >
          Auto
        </button>
      </label>
    </div>
  );
};
```
**Usage**  
```tsx
<Chapter
  title="Typeface as Voice"
  explanation="Blend from neutral to expressive; linger wherever the tone resonates."
  content={(progress)=>(
    <VoicePangram progress={progress} className="mx-auto max-w-3xl text-slate-900" />
  )}
/>
```

**Acceptance**  
- At progress 0, “Modern Sans” is dominant; progress 1 lands on “Technical Mono”. Intermediate values produce believable blends without layout shift.  
- Dragging the slider overrides scroll-driven progress until “Auto” is tapped or the pointer lifts.  
- Labels update in sync with the audible blend, and reduced-motion users still see instantaneous swaps with no lingering animations.  
- The pangram never reflows or jitters; letters simply fade/lift, keeping the baseline perfectly steady.

---

## [FN-1] Finale — orchestrated paragraph

**What’s off now**  
- The section still reads like the original screenshot: minor weight shifts, static background, no sense of crescendo.  
- Words animate independently without stagecraft—there’s no lighting cue, no breath between beats, no payoff.  
- When users pause mid-scroll nothing interesting holds; it just looks like a slightly bolder paragraph.  
- Reduced-motion mode collapses to the same plain layout, so the “finale” never feels special for anyone.

**Experience goals**  
- Stage the paragraph like a micro performance: lights dim, “performance.” slams down, “size” pops vertically, “harmony” breathes outward, “sing.” levitates with spotlight haze.  
- Use a shared beat map so each token hands the baton to the next; on still frames you should *see* energy stored in the typography.  
- Color + depth should react: a radial glow follows the active word, baseline indicators pulse in sync.  
- Reduced-motion users still see the theatrical state changes (color/weight/stacking) even if the tween is instant.

**Make it excellent**  
- Wrap the paragraph in a `figure` with a `stage` background: gradient wash, vignette, and a subtle “light rig” grid that intensifies as progress climbs.  
- Define beat windows for `perf`, `size`, `harm`, `sing`, and a global “stage” beat controlling backdrop brightness + underline bars. Use one easing helper (`easeInOutCubic`) to keep timing musical.  
- For each token, animate multiple properties at once (weight + tracking + underline for `perf`, vertical scale + drop shadow for `size`, tracking + tint + letter casing for `harm`, italic + upward drift + glow for `sing`).  
- Add top-right HUD text (“Cue: HARMONY”) that updates as beats advance; set `aria-live="polite"` so screen readers get the baton callouts.  
- Reduced-motion: skip the tweens but jump each token to its peak styling with the stage background already lit.

**Code (new component)** `FinaleParagraph.tsx`
```tsx
// src/components/FinaleParagraph.tsx  // [FN-1]
import React, { useMemo } from "react";
import { clamp01, easeInOutCubic, usePrefersReducedMotion } from "../utils/ease";

const SCRIPT = [
  "Good typography is a ",
  { key: "perf", text: "performance." },
  " Every element—",
  { key: "size", text: "size" },
  ", weight, space, and form—works in ",
  { key: "harm", text: "harmony" },
  " to create meaning, to guide the eye, and to make words ",
  { key: "sing", text: "sing." },
] as const;

const windows = {
  stage: [0, 1],
  perf: [0.05, 0.35],
  size: [0.3, 0.6],
  harm: [0.55, 0.8],
  sing: [0.75, 1],
} as const;

const sampleWindow = (p: number, [start, end]: readonly [number, number]) =>
  isNaN(start) || end === start ? 0 : clamp01((p - start) / (end - start));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const FinaleParagraph: React.FC<{ progress?: number; className?: string }> = ({
  progress = 0,
  className = "",
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const driver = prefersReduced ? 1 : clamp01(progress);

  const beats = useMemo(() => {
    const stage = easeInOutCubic(sampleWindow(driver, windows.stage));
    const perf = easeInOutCubic(sampleWindow(driver, windows.perf));
    const size = easeInOutCubic(sampleWindow(driver, windows.size));
    const harm = easeInOutCubic(sampleWindow(driver, windows.harm));
    const sing = easeInOutCubic(sampleWindow(driver, windows.sing));
    return { stage, perf, size, harm, sing };
  }, [driver]);

  const activeCue =
    beats.sing > 0.4
      ? "SING"
      : beats.harm > 0.4
      ? "HARMONY"
      : beats.size > 0.4
      ? "SIZE"
      : beats.perf > 0.2
      ? "PERFORMANCE"
      : "INTRO";

  return (
    <figure
      className={`relative mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-slate-900/10 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-[min(5vw,48px)] text-slate-900 shadow-[0_40px_120px_rgba(15,23,42,0.22)] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% ${lerp(80, 30, beats.stage)}%, rgba(15,23,42,${
          0.15 + beats.stage * 0.35
        }), transparent 65%)`,
      }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400" aria-live="polite">
        <span>Finale</span>
        <span>Cue: {activeCue}</span>
      </div>

      <p className="balanced-copy text-[clamp(30px,5.6vw,82px)] leading-[1.06] text-current">
        {SCRIPT.map((segment, index) => {
          if (typeof segment === "string") return <span key={index}>{segment}</span>;

          if (segment.key === "perf") {
            return (
              <span
                key={index}
                className="relative inline-block font-serif"
                style={{
                  fontWeight: lerp(500, 900, beats.perf),
                  letterSpacing: `${lerp(-0.005, -0.09, beats.perf)}em`,
                }}
              >
                {segment.text}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-[-0.12em] h-[0.15em] rounded-full bg-gradient-to-r from-rose-400 via-rose-600 to-orange-400 opacity-80"
                  style={{
                    transform: `scaleX(${lerp(0, 1, beats.perf)})`,
                    transformOrigin: "0% 50%",
                    opacity: beats.perf,
                  }}
                />
              </span>
            );
          }

          if (segment.key === "size") {
            return (
              <span
                key={index}
                className="inline-block origin-bottom font-black"
                style={{
                  transform: `translateY(${lerp(6, -14, beats.size)}px) scale(${lerp(0.9, 2.4, beats.size)})`,
                  textTransform: "uppercase",
                  letterSpacing: `${lerp(0.04, 0.06, beats.size)}em`,
                  filter: `drop-shadow(0 ${beats.size * 18}px ${20}px rgba(15,23,42,0.35))`,
                }}
              >
                {segment.text}
              </span>
            );
          }

          if (segment.key === "harm") {
            return (
              <span
                key={index}
                className="inline-block font-semibold"
                style={{
                  color: `hsl(${lerp(200, 320, beats.harm)} 70% ${lerp(30, 55, beats.harm)}%)`,
                  letterSpacing: `${lerp(0.02, 0.16, beats.harm)}em`,
                  textDecoration: beats.harm > 0.2 ? "underline" : "none",
                  textDecorationStyle: "wavy",
                  textDecorationColor: `hsla(${lerp(200, 320, beats.harm)},70%,60%,${beats.harm})`,
                }}
              >
                {segment.text}
              </span>
            );
          }

          if (segment.key === "sing") {
            return (
              <span
                key={index}
                className="inline-block font-medium"
                style={{
                  fontStyle: beats.sing > 0.3 ? "italic" : "normal",
                  transform: `translateY(${lerp(0, -28, beats.sing)}px) rotate(${lerp(0, -3, beats.sing)}deg)`,
                  color: `rgba(99,102,241,${lerp(0.4, 1, beats.sing)})`,
                  textShadow: `0 ${lerp(0, 30, beats.sing)}px ${lerp(6, 32, beats.sing)}px rgba(99,102,241,0.6)`,
                }}
              >
                {segment.text}
              </span>
            );
          }

          return null;
        })}
      </p>

      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-slate-400">
        <span className="flex-1 bg-gradient-to-r from-slate-300/0 via-slate-300/40 to-slate-300/0" style={{ height: 1 }} />
        <span>{Math.round(driver * 100)}%</span>
      </div>
    </figure>
  );
};
```
**Usage**  
```tsx
<Chapter
  title="Finale"
  explanation="One paragraph, four cues—watch them pass the baton."
  content={(progress)=>(
    <FinaleParagraph progress={progress} className="text-slate-900" />
  )}
/>
```

**Acceptance**  
- The stage background, cue HUD, and paragraph all react together; as you scrub progress you *see* lighting + typography trade focus.  
- Each beat feels theatrical: “performance.” slams with underline flare, “size” vaults upward with a drop shadow, “harmony” opens into a colorful chord, “sing.” floats/glows.  
- Pausing mid-scroll freezes a distinct tableau (no bland intermediate frames).  
- Reduced-motion users skip tweens but still see the staged emphasis states and cue labels.  
- Paragraph width never exceeds 38 ch; even at peak drama, copy stays readable.

---

## [GS-2] Global helpers & perf

**What’s off now**  
- Components with pointer loops (`HappyWord`, `VibrateWord`, scrolling `requestAnimationFrame`s) keep running even when their chapter is off-screen, burning CPU/battery.  
- Each section re-implements `prefers-reduced-motion` checks and bespoke easing functions, so motion feels inconsistent and code size balloons.  
- Long paragraphs still ragged-wrap; there’s no `text-wrap: balance` safety net or shared `max-width`, so type locks look different per section.

**Make it excellent**  
- Build a single **visibility gate** hook that pauses/resumes any loop when its container leaves the viewport. Use it for pointer listeners, `requestAnimationFrame`, and scroll watchers so inactive chapters sleep.  
- Centralize motion helpers (`clamp01`, `easeInOutCubic`, `easeOutBack`, etc.) and the `prefers-reduced-motion` hook in `src/utils/ease.ts` to share easing curves + respect user settings everywhere.  
- Add a typography utility class (or root style) that applies `text-wrap: balance`, `max-width`, and balanced leading to long-form content; use it on any paragraph > ~32 ch.  
- Document the handshake: every interactive component should import the shared hooks/utilities rather than redefining them.

**Code (helpers)**  
```tsx
// src/utils/inview.ts  // [GS-2] viewport guard
export type VisibilityCallback = (visible: boolean) => void;

export const whenInView = (element: Element, callback: VisibilityCallback, options?: IntersectionObserverInit) => {
  const io = new IntersectionObserver(
    (entries) => callback(entries[0]?.isIntersecting ?? false),
    { threshold: 0.1, rootMargin: "0px", ...options }
  );
  io.observe(element);
  return () => io.disconnect();
};
```

```tsx
// src/hooks/useVisibilityGate.ts  // [GS-2]
import { useEffect, useState } from "react";
import { whenInView } from "../utils/inview";

export const useVisibilityGate = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return whenInView(el, setVisible);
  }, [ref]);
  return visible;
};

// Usage:
// const ref = useRef<HTMLDivElement>(null);
// const active = useVisibilityGate(ref);
// const tick = useRafLoop({ disabled: !active });
```

```tsx
// src/utils/ease.ts  // [GS-2] single easing + motion utilities
import { useEffect, useState } from "react";

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (t: number, overshoot = 1.70158) => {
  const x = clamp01(t);
  const o = overshoot + 1;
  return 1 + o * Math.pow(x - 1, 3) + overshoot * Math.pow(x - 1, 2);
};

export const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return prefers;
};
```

```css
/* src/index.css  // [GS-2] balanced paragraphs */
.balanced-copy {
  text-wrap: balance;
  max-width: 38ch;
  line-height: 1.08;
  margin-inline: auto;
}
```

**Acceptance**  
- `HappyWord`, `VibrateWord`, floaty chapters, etc. stop consuming CPU when scrolled off-screen and resume immediately upon re-entry.  
- No component defines its own easing/`prefers-reduced-motion` hook; everything imports from `src/utils/ease.ts`, so motion curves match across the experience.  
- All long-form text blocks use `.balanced-copy` (or the equivalent utility), visibly improving rag quality without manual soft returns.  
- Lighthouse/Performance tab shows reduced main-thread time when only one chapter is in view (verify by profiling before/after the visibility gate).

---

## How to run this plan

1. Pick a tag (e.g., **[CV-1]**) and apply the patch in the listed file(s).  
2. Test against the **Acceptance** list under that tag.  
3. Commit with the tag: `feat([CV-1]): stroke-through mask + draw-on`.  
4. Repeat for the next tag.

When these land, the “rest of the sections” won’t just be finished—they’ll feel authored, with typography behaving like a living material.
