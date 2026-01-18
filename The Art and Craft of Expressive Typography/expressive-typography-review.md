
# Expressive Typography — Fix & Polish Plan (v2.1)

Purpose: document **what’s off** in each study and **exactly how to make it excellent**.  
Structure: each item is self‑contained so you can ask the AI coder to work on any subset.

Stack assumptions: **Vite + React 19 + TypeScript + Tailwind (CDN)**, no heavy animation libs. Keep existing `Chapter` pattern where `content={(progress)=> ...}` exposes a **0–1** scroll progress for that section. Respect `prefers-reduced-motion` everywhere.


---

## Index of tasks

- [CO-1] Cold Open — **EXPRESSIVE / TYPOGRAPHY**
- [TH-1] Thesis — **behavior / voice / emotion**
- [SC-1] Scale as Meaning — **LOUD**
- [WG-1] Weight & Gravity — **broken**
- [PA-1] Presence & Absence — **miss_ng**
- [TN-1] Texture & Nervous Energy — **vibrate**
- [EP-1] Elasticity & Pressure — **squish**
- [PP-1] Path & Pictogram — **EXIT**
- [MM-1] Medium as Mood — **FLOAT**
- [GL-1] Global polish (fonts, perf, a11y)

> Tip: search each task code by its **tag** (e.g., `// [PA-1]`) when editing.

---

## [CO-1] Cold Open — EXPRESSIVE / TYPOGRAPHY

**What’s off**  
- Variable‑font morph can look **jumpy** on some screens (layout shifts as weight changes).  
- No **letter‑spacing compensation** as weight grows → feels cramped at the end.  
- Progress is tied to **window scroll**, not the section → effect starts too early/late on some viewports.  
- FOUT/FOIT risk (fonts load after first paint) → first impression can be inconsistent.
- The first word "EXPRESSIVE" starts off a little too thin. Increase weight.

**Make it excellent**  
1. Drive progress from the **section’s own viewport fraction**, not global scroll.  
2. Add **tracking compensation** when weight increases.  
3. Preload fonts + keep a **non‑variable fallback** that doesn’t jump.  
4. Freeze at a tasteful midstate for `prefers-reduced-motion`.

**Code — new hook** `useElementProgress.ts` (reusable elsewhere)
```tsx
// src/hooks/useElementProgress.ts
import { useEffect, useState } from "react";

export function useElementProgress(el: HTMLElement | null, margin = 0): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      const start = Math.min(h, Math.max(-r.height, r.top - margin));
      const end = Math.max(1, r.height + h - margin * 2);
      const p = 1 - (start + r.height) / end;
      setT(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    const opt: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", onScroll, opt);
    window.addEventListener("resize", onScroll, opt);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [el, margin]);
  return t;
}
```

**Code — ColdOpen component (replace existing)**
```tsx
// src/components/ColdOpen.tsx  // [CO-1]
import React, { useRef } from "react";
import { useElementProgress } from "../hooks/useElementProgress";

const ease = (x:number)=> x<0.5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2)/2; // easeInOutQuad

export const ColdOpen: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const p = useElementProgress(ref.current, 0);

  // Compensations
  const wght = 300 + ease(p) * 600;           // 300 -> 900
  const opsz = 36 + ease(p) * 36;             // 36 -> 72 (if supported)
  const track = (1 - ease(p)) * 0.02 - ease(p) * 0.01; // tighten slightly as weight grows

  return (
    <section ref={ref} className="h-screen flex flex-col items-center justify-center px-4 select-none">
      <h1 className="leading-none tracking-tight text-center">
        <span
          style={{ fontFamily: "Fraunces, serif", fontVariationSettings: `"wght" ${wght}, "opsz" ${opsz}`, letterSpacing: `${track}em` }}
          className="block text-[clamp(48px,10vw,140px)] font-extrabold"
        >
          EXPRESSIVE
        </span>
        <span className="block text-[clamp(36px,7vw,96px)] font-light tracking-[.08em]">TYPOGRAPHY</span>
      </h1>
      <noscript className="sr-only">Expressive Typography</noscript>
    </section>
  );
};
```

**HTML head — preload** (merge with existing)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Fraunces:opsz,wght@9..144,100..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Fraunces:opsz,wght@9..144,100..900&display=swap">
```

**Acceptance**  
- First viewport shows **no layout jump** when fonts load.  
- Weight/optical size interpolate smoothly; headline stays readable at all sizes.  
- With reduced motion, the state is static at ~`wght=650` and tracking tightened.


---

## [TH-1] Thesis — behavior / voice / emotion

**What’s off**  
- Changes are discrete; can feel **twitchy** while scrolling.  
- Italic/opacity shifts can cause **line reflow** and uneven emphasis.  
- Not enough **contrast** between “voice” and surrounding words.

**Make it excellent**  
- Quantize progress into **3 stable bands** to avoid jitter.  
- Use **variable weight** for “behavior” rather than pure `fontWeight` (smoother).  
- Use **grade-like** effect for “emotion” (opacity + slight blur) without dropping below WCAG contrast.  
- Add **typeface swap** on “voice” with a brief crossfade, not layout-jump.

**Code**  
```tsx
// in Thesis <Chapter/> content  // [TH-1]
const band = (p:number)=> p<0.33? 0 : p<0.66? 0.5 : 1;  // 3 stable states
const t = band(progress);

<p className="text-3xl md:text-5xl lg:text-6xl max-w-4xl font-light leading-tight">
  Typography isn’t decoration. It’s{" "}
  <span style={{ fontFamily:'Fraunces, serif', fontVariationSettings: `"wght" ${300 + t*500}` }} className="inline-block">
    behavior
  </span>
  {", "}
  <span className="inline-block relative">
    <span className="transition-opacity duration-300" style={{ opacity: 1 - t }}>{/* Inter */}voice</span>
    <span className="absolute inset-0 transition-opacity duration-300 font-playfair" style={{ opacity: t }} aria-hidden>voice</span>
  </span>
  {", and "}
  <span className="inline-block" style={{ opacity: 0.9 - t*0.4, filter: `contrast(${100 - t*15}%)` }}>
    emotion
  </span>{" "}
  on a grid.
</p>
```

**Acceptance**  
- While scrolling, the sentence settles into **3 clear states** with no twitching.  
- “voice” crossfades to Playfair without reflow; “emotion” remains readable (contrast ratio ≥ 4.5:1).


---

## [SC-1] Scale as Meaning — LOUD

**What’s off**  
- Current `scaleX/scaleY` feels **rubbery** but lacks **attack/release**.  
- No **tracking compensation**; large sizes get cramped.  
- The motion stops abruptly at the end.

**Make it excellent**  
- Use **squash & stretch with overshoot** (`easeOutBack`).  
- Add **letter‑spacing** expansion with size.  
- Anchor transform to **baseline** so the word doesn’t “float.”

**Code**  
```tsx
// in TypeStudies.tsx  // [SC-1] refine SquishWord
const easeOutBack = (x:number)=> 1 + (1.70158+0.3)*Math.pow(x-1,3) + 1.70158*Math.pow(x-1,2);

export const SquishWord: React.FC<{ text:string; progress:number; max?:number; className?:string }>
= ({ text, progress, max=.32, className="" }) => {
  const t = easeOutBack(Math.min(1, Math.max(0, progress)));
  const sx = 1 + t * max * 1.2;
  const sy = 1 - t * max;
  const track = (t*0.06 - 0.01); // start slightly tight, open as it gets loud
  return (
    <span className={`inline-block origin-bottom will-change-transform ${className}`}
      style={{ transform:`scale(${sx},${sy})`, letterSpacing:`${track}em`}}>{text}</span>
  );
};
```

**Acceptance**  
- Word “lands” with a tiny overshoot then settles; spacing feels right at peak scale.


---

## [WG-1] Weight & Gravity — broken

**What’s off**  
- The hinge looks **staged**; letters after the pivot move as a rigid block.  
- No sense of **acceleration** (gravity).  
- Overlap order isn’t consistent; the fallen letters can visually “float” above earlier ones.

**Make it excellent**  
- Animate with **per-letter delays** and **quadratic fall**.  
- Add **depth** via small `drop-shadow` and z‑index ordering.  
- Allow the “k” to **hinge** then **let go**, so “en” continues falling.

**Code**  
```tsx
// in TypeStudies.tsx  // [WG-1] improved BrokenWord
export const BrokenWord: React.FC<{ text:string; pivotIndex:number; p?:number; className?:string }>
= ({ text, pivotIndex, p=1, className="" }) => {
  const letters = Array.from(text);
  const t = Math.max(0, Math.min(1, p));
  const fall = t*t; // acceleration
  return (
    <span className={`inline-flex will-change-transform ${className}`} aria-label={text}>
      {letters.map((ch,i)=>{
        if (i < pivotIndex) return <span key={i} className="inline-block">{ch}</span>;
        if (i === pivotIndex) {
          const rot = 12 + 35*fall;
          return <span key={i} className="inline-block" style={{ transformOrigin:"0% 60%", transform:`rotate(${rot}deg)` }}>{ch}</span>;
        }
        const n = i - pivotIndex;
        const dy = (n*20 + 60) * fall;
        const dx = (n*8 + 4) * fall;
        const rot = 30 + n*12*fall;
        return (
          <span key={i} className="inline-block -ml-[0.02em]" style={{ transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`, filter:"drop-shadow(0 2px 1px rgba(0,0,0,.15))", zIndex: 10 - i }}>
            {ch}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </span>
  );
};
```
Usage in chapter: `content={(p)=>(<div className="text-[min(14vw,160px)]"><BrokenWord text="broken" pivotIndex={3} p={p}/></div>)}`

**Acceptance**  
- The hinge releases into a believable fall; letters **accelerate** and layer correctly.


---

## [PA-1] Presence & Absence — miss_ng

**What’s off**  
- The “missing” letter is currently just **painted transparent**, so the rhythm is technically intact but the absence never lands—the glyph is still there for anyone inspecting outlines.  
- If we remove the glyph, we only reserve `0.5ch`, which is **wildly wrong** for the lowercase “i” at large optical sizes (and worse if we ever try another letter).  
- No high-contrast guardrails: the placeholder vanishes entirely under `forced-colors` or `prefers-contrast: more`, so low-vision readers only see a broken word with **collapsed spacing**.  
- Screen readers get the bare word “missing” with no hint that a character intentionally disappeared, so the concept **never reaches non-visual users**.

**Make it excellent**  
1. Add a tiny hook that **measures the target glyph width** after fonts load + whenever the container resizes (use `ResizeObserver` + `document.fonts.ready`).  
2. Replace `MissingLetterWord` with `CalibratedMissingLetter` that actually omits the glyph but drops in a **slot** whose width is the measured value (fallback to `0.45ch` while we wait).  
3. Inside that slot, render a 1px stem (and a thin baseline dot) whose color adapts to the current `currentColor`, and add a `forced-colors` override so it never vanishes when Windows high-contrast kicks in.  
4. Provide an `aria-description` like “letter i intentionally absent” so VoiceOver/NVDA announce the conceit, while keeping the sr-only full word for spelling verification.  
5. Drive the disappearance with chapter progress: on first reveal (`p≈0`) the glyph is intact, then fades between ~15–55% progress until only the placeholder remains.

**Code — hook** `src/hooks/useGlyphSlot.ts`  
```tsx
// [PA-1]
import { useLayoutEffect, useRef, useState } from "react";

export function useGlyphSlot(char: string) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || !char) return;
    const probe = document.createElement("span");
    Object.assign(probe.style, {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
      whiteSpace: "pre",
    });
    probe.textContent = char;
    host.appendChild(probe);

    const measure = () => setWidth(probe.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => { ro.disconnect(); probe.remove(); };
  }, [char]);

  return { hostRef, width };
}
```

**Code — component** `src/components/CalibratedMissingLetter.tsx`  
```tsx
// [PA-1]
import React from "react";
import { useGlyphSlot } from "../hooks/useGlyphSlot";

type CalibratedProps = {
  text: string;
  index: number;
  progress?: number;
  className?: string;
  fadeStart?: number;
  fadeEnd?: number;
};

export const CalibratedMissingLetter: React.FC<CalibratedProps> = ({
  text,
  index,
  progress = 1,
  className = "",
  fadeStart = 0.15,
  fadeEnd = 0.55,
}) => {
  const letters = React.useMemo(() => Array.from(text), [text]);
  const target = letters[index] ?? "";
  const { hostRef, width } = useGlyphSlot(target);
  const slotWidth = width != null ? `${width}px` : "0.45ch";
  const fade = Math.min(1, Math.max(0, (progress - fadeStart) / Math.max(0.0001, fadeEnd - fadeStart)));

  return (
    <span
      ref={hostRef as any}
      className={`inline-flex select-none tracking-tight ${className}`}
      aria-label={text}
      aria-description={`letter ${target || "?"} intentionally absent`}
    >
      {letters.map((ch, i) => {
        if (i !== index) return <span key={i} className="inline-block align-baseline">{ch}</span>;
        return (
          <span key={i} className="inline-flex items-stretch" aria-hidden style={{ width: slotWidth }}>
            <span className="relative inline-flex w-full justify-center items-end">
              <span
                className="missing-slot-stem absolute left-1/2 -translate-x-1/2 w-px h-[0.9em] bg-current/25 dark:bg-current/40"
                style={{ opacity: fade, transition: "opacity 260ms ease" }}
              />
              <span
                className="missing-slot-dot absolute bottom-0 left-1/2 -translate-x-1/2 w-[0.15em] h-[0.15em] rounded-full bg-current/40"
                style={{ opacity: fade, transition: "opacity 260ms ease" }}
              />
              <span
                className="absolute inset-0 flex items-end justify-center"
                style={{ opacity: 1 - fade, transition: "opacity 280ms ease" }}
              >
                {target}
              </span>
            </span>
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </span>
  );
};
```
Add a forced-colors helper in `src/index.css` so the placeholder survives high-contrast:
```css
/* [PA-1] */
@media (forced-colors: active) {
  .missing-slot-stem,
  .missing-slot-dot {
    background: CanvasText !important;
    forced-color-adjust: none;
  }
}
```

Usage: `content={(p) => (<div className="text-[min(12vw,120px)] font-semibold"><CalibratedMissingLetter text="missing" index={4} progress={p} /></div>)}`

**Acceptance**  
- The reserved gap **perfectly matches** the removed glyph at every viewport size, variable-weight value, and zoom level.  
- Placeholder stem/dot stays visible in dark mode, 200% zoom, and Windows high-contrast (thanks to `.missing-slot-*`).  
- VoiceOver/NVDA speak “letter i intentionally absent” after the word, communicating the idea to non-visual readers.  
- Switching to any other letter (set `index`) still feels balanced without retuning constants.  
- As you scroll from `p≈0.15` to `p≈0.55`, the full glyph fades while the placeholder fades in, so the disappearance is something you experience, not just notice afterward.


---

## [TN-1] Texture & Nervous Energy — vibrate

**What’s off**  
- Static offsets (`±2.5px`) look **muddy** on 140px letterforms and **illegible** on smaller displays.  
- The “ghost” layers ignore scroll progress, so the headline feels equally frantic even before the section is fully in view.  
- `prefers-reduced-motion` only disables the keyframe but keeps three offset layers that still blur the word, which defeats the accessibility goal.  
- Mobile GPUs take a hit because we’re animating with `filter` + multiple absolute spans even when the section is offscreen or the amplitude is zero.

**Make it excellent**  
1. Measure the rendered font size (via `ResizeObserver`) and derive the jitter amplitude as ~3–6px max (≈2–9% of cap height) with a baseline 1–1.4px tremor so it always feels alive. Clamp harder on narrow viewports (≤640px).  
2. Drive intensity from the chapter’s `progress`: at `p≈0` the ghosts sit right on top of the glyph; by `p=1` they drift out to the clamped amplitude.  
3. When `prefers-reduced-motion` is set, keep a single crisp word and a faint offset shadow (no animation, no parallax layers).  
4. Expose the amplitude/duration through CSS variables so we can keep the jitter short (≈40–60 ms) yet intense.  
5. Expose an `<span className="sr-only">` with the plain word (already there via `SplitWord`, but this component should do it directly since it never uses `SplitWord`).

**Code — `src/components/TypeStudies.tsx`**  
```tsx
// [TN-1] responsive vibrate
export const VibrateWord: React.FC<{ text:string; progress?:number; className?:string }>
= ({ text, progress=1, className="" }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [fontSize, setFontSize] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => setFontSize(parseFloat(getComputedStyle(el).fontSize));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mq = typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false;
  const maxAmp = fontSize * (mq ? 0.12 : 0.22);
  const amp = prefersReduced ? 0 : Math.min(maxAmp, fontSize * 0.04 + maxAmp * progress);
  const jitterDuration = `${Math.max(38, 80 - progress * 30)}ms`;
  const jitterStyle = prefersReduced
    ? undefined
    : ({
        animationDuration: jitterDuration,
        '--jitter-x': `${amp * 0.15}px`,
        '--jitter-y': `${amp * -0.1}px`,
      } as React.CSSProperties);

  const ghosts = prefersReduced ? [] : [
    { dx: amp, dy: amp * 0.15, alpha: 0.22 },
    { dx: -amp * 0.9, dy: -amp * 0.05, alpha: 0.16 },
    { dx: 0, dy: amp * 0.55, alpha: 0.12 },
  ];

  return (
    <span ref={ref} className={`relative inline-flex font-black leading-none tracking-tight ${className}`} style={{ filter: "contrast(115%)" }}>
      {ghosts.map((g, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute inset-0 select-none"
          style={{ color: `rgba(0,0,0,${g.alpha})`, transform: `translate(${g.dx}px, ${g.dy}px)` }}
        >
          {text}
        </span>
      ))}
      <span className={prefersReduced ? "relative" : "relative jitter-var"} style={jitterStyle}>
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
};
```
Usage: `content={(p)=>(<div className="text-[min(18vw,160px)]"><VibrateWord text="vibrate" progress={p} /></div>)}`

**Code — global styles** `src/index.css`  
```css
/* [TN-1] jitter uses custom amplitude */
@keyframes jitter-var {
  0% { transform: translate(var(--jitter-x, 0px), var(--jitter-y, 0px)); }
  100% { transform: translate(calc(var(--jitter-x, 0px) * -1), calc(var(--jitter-y, 0px) * -1)); }
}
.jitter-var {
  animation: jitter-var 60ms steps(1, end) infinite alternate;
}
@media (prefers-reduced-motion: reduce) {
  .jitter-var { animation: none !important; }
}
```

**Acceptance**  
- Even doubled, ghost offsets stay within ~0.02–0.09 cap height, so the word feels jittery but still readable.
- Scroll progress modulates intensity: at the top of the section all letters align; by the time the caption is centered the word shimmers noticeably.  
- With `prefers-reduced-motion`, only the solid word + a single soft shadow remain, no keyframe animation.  
- FPS stays ≥55 during scroll on an iPhone 13/Android Pixel equivalent (no continuous RAF, only CSS transforms).  
- Screen readers still announce “vibrate” exactly once thanks to the dedicated `sr-only` span.


---

## [EP-1] Elasticity & Pressure — squish

**What’s off**  
- After the cleanup pass the section reads elegant but **inert**—the scroll just scales a single transform with a mild clamp. There’s no visual drama, no sense of the word storing, releasing, or spilling energy.  
- The “ground plane” shadow helps, but nothing reacts around the word. The background stays flat, color never breathes, and the viewer doesn’t feel pressure radiating outward.  
- Letters still move in lockstep, so even with the map hook, the center of the word doesn’t bulge first, the edges don’t resist, and the counters barely flex before everything relaxes.  
- There’s no **stretch** moment: once pressure drops, the letters simply pop back—no rebound, no horizontal snap, no echoing ripple.  
- Reduced-motion mode collapses the experience entirely into a static pose. Users who opt out of animation should still feel compression through form, lighting, and stacked layers.

**Make it excellent**  
1. Treat scroll progress as **input to a springy pressure signal + release memory**. Use a `useSpringValue` helper (just a physics-based integrator or a `dampedSpring` util) so downward scroll pumps pressure quickly while upward scroll lags behind and overshoots by ~6%, giving a true “squish, inhale, stretch” cycle.  
2. Surround the characters with a **pressure field**: a low-contrast blob that radiates outward, a highlight strip that pinches inward, maybe even a subtle “goo” grain mask when pressure exceeds 0.8. These layers should parallax a few pixels to imply the word is pressing into a flexible surface.  
3. Drive each letter from a center-out easing curve. Middle glyphs sink deepest, edge glyphs resist, and the cap height measurement modulates how far they travel. Allow the outer letters to briefly stretch taller than 1.0 on rebound so we get both compression and stretch in a single gesture.  
4. Add a **horizontal snap** on release: when pressure drops quickly, temporarily skew the word to the right, widen tracking, and flash a lighter fill for 120 ms. That little flare sells the elastic snap.  
5. For `prefers-reduced-motion`, freeze the spring but keep the sculpted layers: show the depressed word, the fat base shadow, and a static crinkle texture so the material still reads as soft vs. rigid even without motion.

**Code**  
```tsx
// src/components/TypeStudies.tsx  // [EP-1]
const clamp = (v:number, min=0, max=1) => Math.min(max, Math.max(min, v));

const useSpringValue = (target:number, stiffness=380, damping=32) => {
  const [{ value, velocity }, set] = useState({ value: target, velocity: 0 });
  const raf = useRef<number | null>(null);
  useLayoutEffect(() => {
    const step = () => {
      set(({ value, velocity }) => {
        const delta = target - value;
        const accel = stiffness * delta - damping * velocity;
        const nextVel = velocity + accel * 0.016;
        const nextVal = value + nextVel * 0.016;
        return { value: nextVal, velocity: nextVel };
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [target, stiffness, damping]);
  return value;
};

export const SquishScene: React.FC<{ text:string; progress:number; className?:string }>
= ({ text, progress, className="" }) => {
  const prefersReduced = usePrefersReducedMotion();
  const wordRef = useRef<HTMLElement>(null);
  const [capHeight, setCapHeight] = useState(0);

  useLayoutEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const measure = () => {
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (!Number.isNaN(size)) setCapHeight(size * 0.68);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const base = clamp(progress, 0, 1);
  const pressure = prefersReduced ? 0.55 : clamp(useSpringValue(base), 0, 1.1);
  const retract = prefersReduced ? 0 : Math.max(0, pressure - base);
  const bounce = prefersReduced ? 0 : Math.max(0, base - pressure * 0.8);

  const stretchX = 1 + pressure * 0.55 + bounce * 0.2;
  const squashY = 1 - pressure * 0.38 + bounce * 0.12;
  const snapSkew = (retract - bounce) * 6;
  const tracking = -0.02 + pressure * 0.07 + bounce * 0.03;

  const mid = (text.length - 1) / 2 || 0;
  const letterMap = (i:number) => {
    const dist = Math.abs(i - mid) / (mid || 1);
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
          style={{ opacity: highlightOpacity, filter: `blur(${18 + pressure * 12}px)`, transform: `translate(-50%,-50%) scale(${1 + pressure * 0.25})` }}
        />
        <span
          className="absolute left-1/2 bottom-[-0.1em] h-[0.22em] w-[180%] -translate-x-1/2 rounded-full bg-black/60 blur-[22px]"
          style={{ opacity: fieldOpacity, transform: `translate(-50%,0) scaleX(${1 + pressure * 0.9}) translateY(${capHeight * 0.08}px)` }}
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

// src/index.css  // [EP-1]
.squish-noise {
  pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,0.1) 8%, transparent 35%);
  background-size: 120px 120px;
  mix-blend-mode: screen;
  animation: squish-noise-flicker 800ms steps(2, end) infinite;
}
@keyframes squish-noise-flicker {
  0% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(-6px,3px,0); }
  100% { transform: translate3d(4px,-5px,0); }
}

// src/App.tsx  // [EP-1]
import { SquishScene } from "./components/TypeStudies";
<Chapter
  title="Elasticity & Pressure"
  explanation="Compression and stretch make type feel physical."
  content={(p) => (
    <div className="text-[min(20vw,180px)] font-black">
      <SquishScene text="squish" progress={p} />
    </div>
  )}
/>
```

**Acceptance**  
- Scroll down hard: the center letters plunge first, the edges resist, the pad bulges, and the word flashes warmer color. Scroll back up quickly and you see a visible stretch + lateral snap before it settles.  
- Maximum compression keeps counters ≥58% height yet clearly shows bulging stems at 180px and 64px font sizes; rebound briefly stretches ascenders taller than 1.05× baseline.  
- Pressure field + highlight animate smoothly at 60 fps, and the noise flicker only appears when pressure > 0.6 (otherwise zero).  
- Reduced-motion users see the depressed pose, widened pad, and highlight without animation; there is still clear evidence of pressure through form alone.


---

## [PP-1] Path & Pictogram — EXIT

**What’s off**  
- Static snapshot looks odd; animation is there but the **door opening** and **X bend** could be more coordinated.  
- Door wedge overlaps background imperfectly on some themes.  
- Not responsive to section scroll (only time/hover).

**Make it excellent**  
- Drive both the **I‑door angle** and the **X curve** from the chapter’s `progress`.  
- Use a true **cutout** for the door gap (mask), not a rectangle that assumes page background.  
- Keep stroke widths responsive to font size.

**Code (replace component)**  
```tsx
// in TypeStudies.tsx  // [PP-1]
export const ExitWord: React.FC<{ progress?:number; className?:string }> = ({ progress=1, className="" }) => {
  const t = Math.max(0, Math.min(1, progress));
  const angle = -8 - 18 * t;   // door opens further with scroll
  const open = 0.08 + 0.18 * t; // gap as fraction of cap height

  const d1 = `M15 95 C${55 - 10*t} ${70 + 10*t}, ${65 - 10*t} ${50 - 10*t}, ${105 - 6*t} ${25}`;
  const d2 = `M105 95 C${65 + 10*t} ${70 + 10*t}, ${55 + 10*t} ${50 - 10*t}, ${15 + 6*t} ${25}`;

  return (
    <span className={`inline-flex items-baseline gap-[0.15em] ${className}`} aria-label="EXIT">
      <span className="font-black tracking-tight">E</span>
      <svg viewBox="0 0 120 120" width="0.9em" height="0.9em" aria-hidden className="align-[0.03em]">
        <defs>
          <mask id="doorcut">
            <rect x="0" y="0" width="120" height="120" fill="white"/>
            <rect x="56" y="24" width={120*open} height="72" transform={`rotate(${angle}, 56, 60)`} fill="black"/>
          </mask>
        </defs>
        <g mask="url(#doorcut)">
          <path d={d1} stroke="currentColor" strokeWidth="22" strokeLinecap="round" fill="none"/>
          <path d={d2} stroke="currentColor" strokeWidth="22" strokeLinecap="round" fill="none"/>
        </g>
      </svg>
      <span className="relative font-black inline-block">I</span>
      <span className="font-black tracking-tight">T</span>
    </span>
  );
};
```
Usage: `content={(p)=>(<div className="text-[min(16vw,160px)]"><ExitWord progress={p} /></div>)}`

**Acceptance**  
- As you scroll, the “I” door **opens** and the “X” **leans** toward it in one coordinated gesture.  
- The door cutout reveals the page behind on any background.


---

## [MM-1] Medium as Mood — FLOAT

**What’s off**  
- Continuous animation runs even offscreen; potential perf drain.  
- Amplitude is fixed; can clip on small screens or feel too subtle on large ones.

**Make it excellent**  
- Start/stop the RAF **only when in view**.  
- Scale amplitude by **font size**; allow a gentle oversway when entering view.

**Code (update FloatWord)**  
```tsx
// in TypeStudies.tsx  // [MM-1]
export const FloatWord: React.FC<{ text:string; amplitude?:number; speed?:number; className?:string }>
= ({ text, amplitude=8, speed=1, className="" }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const rafRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    const el = ref.current; if(!el) return;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const letters = el.querySelectorAll<HTMLSpanElement>("[data-letter]");
    const onObserve = (entries: IntersectionObserverEntry[]) => {
      const vis = entries[0].isIntersecting;
      if (!vis) { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; return; }
      const t0 = performance.now();
      const step = (t:number) => {
        const k = (t - t0)/1000;
        letters.forEach((node,i) => {
          const size = parseFloat(getComputedStyle(node).fontSize);
          const amp = (amplitude + size*0.02);
          const y = Math.sin(k*speed + i*.6) * amp;
          const r = Math.cos(k*speed + i*.6) * 2;
          node.style.transform = `translateY(${y}px) rotate(${r}deg)`;
        });
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(onObserve, { threshold: 0.1 });
    io.observe(el);
    return () => { io.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [amplitude, speed]);

  return <SplitWord ref={ref as any} text={text} className={className}/>;
};
```

**Acceptance**  
- No RAF while offscreen; motion feels buoyant at all sizes; no clipping on mobile.


---

## [GL-1] Global polish

**What’s off**  
- Some sections run animations even when **not in view**.  
- Variable fonts can cause **layout jumps** during load.  
- Not all sections expose **sr‑only** full word for screen readers.

**Make it excellent**  
- For any component with a loop (e.g., FLOAT), guard with **IntersectionObserver**.  
- Use `font-display: optional` for secondary faces to avoid FOIT above the fold.  
- Ensure `SplitWord` always renders a **screen‑reader line** (`sr-only`) with the uninterleaved word.  
- Add a minimal **unit of easing helpers** and reuse everywhere.

**Code — helpers**  
```tsx
// src/utils/ease.ts
export const clamp01 = (x:number)=> Math.min(1, Math.max(0, x));
export const easeInOut = (x:number)=> x<0.5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2)/2;
export const easeOutBack = (x:number)=> 1 + (1.70158+0.3)*Math.pow(x-1,3) + 1.70158*Math.pow(x-1,2);
```

**Acceptance**  
- Lighthouse shows **no major layout shift** warnings (CLS ≤ 0.02 on first viewport).  
- All animated loops pause offscreen; battery usage stays low on mobile.  
- Each study has a readable `sr-only` equivalent.


---

## How to use this doc

1. Pick a tag (e.g., **[WG-1]**).  
2. Apply the code patch in the referenced component/file.  
3. Verify the **Acceptance** list for that task.  
4. Commit with the tag in the message (e.g., `feat([WG-1]): believable hinge + fall`).

**Done well, these edits push the piece from “great demo” to “masterwork”—the typography doesn’t just animate; it behaves.**
