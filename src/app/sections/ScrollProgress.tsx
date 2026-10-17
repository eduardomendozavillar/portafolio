"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress indicator (portfolio-motion): a 2px accent bar pinned to
 * the bottom edge of the sticky header that fills as the page is scrolled.
 * Purely decorative (aria-hidden): navigation stays fully accessible without
 * it. Scroll updates repaint the bar via style width — no per-scroll re-render
 * — and the reduced-motion block in globals.css collapses its transition.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      const bar = barRef.current;
      if (!bar) return;
      bar.style.width = `${(progress * 100).toFixed(1)}%`;
      bar.dataset.progress = String(Math.round(progress * 100));
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
    <div
      ref={barRef}
      aria-hidden="true"
      data-progress="0"
      className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent [transition:width_80ms_linear] motion-reduce:transition-none"
    />
  );
}
