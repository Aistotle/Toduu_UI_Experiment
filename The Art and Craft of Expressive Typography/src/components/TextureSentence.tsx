import React, { useEffect, useState } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (x: number) => x * x * (3 - 2 * x);
const segment = (value: number, start: number, end: number) => smoothstep(clamp01((value - start) / Math.max(0.0001, end - start)));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;

const usePrefersReducedMotion = () => {
  const getPref = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [prefers, setPrefers] = useState<boolean>(getPref);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
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

type TextureSentenceProps = {
  progress?: number;
  className?: string;
};

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
      className={`relative max-w-[58ch] text-[clamp(28px,5vw,64px)] leading-tight tracking-tight text-balance ${className}`.trim()}
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
            backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(0,0,0,0.4), transparent 48%)",
            filter: "blur(0.6px)"
          }}
        />
      </span>
      .
      {prefersReduced && <span className="sr-only">Motion is reduced; showing the final texture state.</span>}
    </p>
  );
};
