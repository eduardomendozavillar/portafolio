"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * One-shot scroll reveal for a whole section block (WU-B).
 *
 * No-JS safety: the parent (server) HTML is never hidden — the hidden state
 * only exists while this client component's own render holds it, and flips to
 * visible when the block first intersects the viewport (~0.15 threshold).
 *
 * Layout shift safety: only `opacity`/`transform` animate; no geometry.
 *
 * Reduced motion: the `.reveal-hidden` state is neutralized in
 * globals.css under `(prefers-reduced-motion: reduce)`, so content is fully
 * visible immediately and nothing transitions.
 */
export function Reveal({ children, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Very old browsers without IntersectionObserver: show immediately.
    // Direct DOM fallback — no state, no re-render (react-hooks lint).
    if (typeof IntersectionObserver === "undefined") {
      element.classList.remove("reveal-hidden");
      element.classList.add("reveal-shown");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        revealed ? `reveal-shown ${className}` : `reveal-hidden ${className}`
      }
    >
      {children}
    </div>
  );
}
