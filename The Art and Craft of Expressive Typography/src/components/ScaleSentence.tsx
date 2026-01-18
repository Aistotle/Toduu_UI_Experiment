import React from "react";

type ScaleSentenceProps = {
  text: string;
  target?: string;
  progress?: number;
  className?: string;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const ScaleSentence: React.FC<ScaleSentenceProps> = ({
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
      style={{
        wordSpacing: `${wordSpacing}em`,
        textWrap: "balance" as any,
        overflow: "visible",
      }}
    >
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token)) {
          return <React.Fragment key={`space-${index}`}>{token}</React.Fragment>;
        }

        const cleanToken = token.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
        const isTarget = cleanToken === target.toLowerCase();

        if (!isTarget) {
          const fade = 1 - grow * 0.55 + settle * 0.25;
          const drift = lerp(0, 4, grow) - lerp(0, 2, settle);
          const tighten = lerp(0, 0.08, grow) - lerp(0, 0.05, settle);
          return (
            <span
              key={index}
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
            key={index}
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

ScaleSentence.displayName = "ScaleSentence";
