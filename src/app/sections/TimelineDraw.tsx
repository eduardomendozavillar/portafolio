"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Viewport-relative y where the draw starts (75% down the viewport). */
const START_RATIO = 0.75;

/**
 * Timeline draw-in (portfolio-motion): a thin accent line that grows along the
 * left edge of the Experiencia track as the section scrolls into view.
 * Decorative (aria-hidden) companion to the per-item reveals; updates repaint
 * the fill via transform only — no per-scroll re-render — and globals.css
 * neutralizes it under prefers-reduced-motion.
 */
export function TimelineDraw({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function update() {
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!track || !fill) return;
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * START_RATIO;
      const span = Math.min(rect.height || 1, viewport);
      const progress = Math.min(Math.max((start - rect.top) / span, 0), 1);
      fill.style.transform = `scaleY(${progress.toFixed(4)})`;
      fill.dataset.progress = String(Math.round(progress * 100));
    }

    update();
    document.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative">
      {/* Hairline base rail + accent fill, left of the items. */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-1 bottom-1 hidden w-px bg-line md:block"
      />
      <div
        ref={fillRef}
        aria-hidden="true"
        data-timeline-draw="true"
        data-progress="0"
        className="absolute -left-3 top-1 bottom-1 hidden w-px origin-top bg-accent [transition:transform_100ms_linear] motion-reduce:transition-none md:block"
        style={{ transform: "scaleY(0)" }}
      />
      {children}
    </div>
  );
}
