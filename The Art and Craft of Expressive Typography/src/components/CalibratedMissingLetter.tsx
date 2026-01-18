import React from "react";
import { useGlyphSlot } from "../hooks/useGlyphSlot";

type CalibratedMissingLetterProps = {
  text: string;
  index: number;
  className?: string;
  /** scroll progress 0–1; 0 keeps glyph, 1 fully absent */
  progress?: number;
  fadeStart?: number;
  fadeEnd?: number;
};

export const CalibratedMissingLetter: React.FC<CalibratedMissingLetterProps> = ({
  text,
  index,
  className = "",
  progress = 1,
  fadeStart = 0.15,
  fadeEnd = 0.55,
}) => {
  const letters = React.useMemo(() => Array.from(text), [text]);
  const target = letters[index] ?? "";
  const { hostRef, width } = useGlyphSlot(target);
  const slotWidth = width != null ? `${width}px` : "0.45ch";
  const range = Math.max(0.0001, fadeEnd - fadeStart);
  const normalized = Math.min(1, Math.max(0, (progress - fadeStart) / range));
  const letterOpacity = 1 - normalized;
  const placeholderOpacity = normalized;

  return (
    <span
      ref={hostRef}
      className={`inline-flex select-none tracking-tight ${className}`}
      aria-label={text}
      aria-description={target ? `letter ${target} intentionally absent` : "letter intentionally absent"}
    >
      {letters.map((ch, i) => {
        if (i !== index) {
          return (
            <span key={i} className="inline-block align-baseline">
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        }

        return (
          <span key={i} className="inline-flex items-stretch" aria-hidden style={{ width: slotWidth }}>
            <span className="relative inline-flex w-full justify-center items-end">
              <span
                className="missing-slot-stem absolute w-px h-[0.9em] bg-current/25 dark:bg-current/40"
                style={{
                  opacity: placeholderOpacity,
                  transition: "opacity 260ms ease",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
              <span
                className="missing-slot-dot absolute bottom-0 w-[0.15em] h-[0.15em] rounded-full bg-current/40"
                style={{
                  opacity: placeholderOpacity,
                  transition: "opacity 260ms ease",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
              <span
                className="absolute inset-0 flex items-end justify-center pointer-events-none"
                style={{
                  opacity: letterOpacity,
                  transform: `translateY(${normalized * -6}px)`,
                  transition: "opacity 280ms ease, transform 280ms ease",
                }}
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
