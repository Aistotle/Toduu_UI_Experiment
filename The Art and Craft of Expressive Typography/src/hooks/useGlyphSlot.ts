import { useLayoutEffect, useRef, useState } from "react";

/**
 * Measure the rendered width of a glyph at the current font styles.
 * Returns a ref for the host node that will contain the measuring span.
 */
export function useGlyphSlot(char: string) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const host = hostRef.current;
    if (!host || !char) {
      setWidth(null);
      return;
    }

    const probe = document.createElement("span");
    Object.assign(probe.style, {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
      whiteSpace: "pre",
      userSelect: "none",
    });
    probe.textContent = char;
    host.appendChild(probe);

    let frame: number | null = null;
    const measure = () => {
      frame = null;
      const rect = probe.getBoundingClientRect();
      if (!rect.width) return;
      setWidth((prev) => (prev === rect.width ? prev : rect.width));
    };
    const schedule = () => {
      if (frame != null) return;
      frame = window.requestAnimationFrame(measure);
    };

    schedule();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(schedule);
      ro.observe(host);
    } else {
      window.addEventListener("resize", schedule);
    }

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) schedule();
    }).catch(() => {});

    return () => {
      cancelled = true;
      if (frame != null) cancelAnimationFrame(frame);
      ro?.disconnect();
      window.removeEventListener("resize", schedule);
      probe.remove();
    };
  }, [char]);

  return { hostRef, width } as const;
}
