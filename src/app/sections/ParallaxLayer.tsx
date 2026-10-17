"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Scroll distance (px) over which each layer reaches its maxPx offset. */
export const PARALLAX_RANGE_PX = 900;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * One hero parallax layer (portfolio-motion): moves at a fixed fraction of
 * maxPx over PARALLAX_RANGE_PX of scroll, capped and transform-only (no
 * re-render, no layout shift). maxPx ≤ 10 by design; negative values shift
 * against the scroll for depth. Decorative wrapper; the effect stops under
 * prefers-reduced-motion and globals.css kills any residual transition.
 */
export function ParallaxLayer({
  maxPx,
  className = "",
  children,
}: {
  maxPx: number;
  className?: string;
  children: ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Environments without matchMedia (very old/basic) run unguarded: the
    // reduced-motion stop hook is a progressive enhancement.
    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    function update() {
      const layer = layerRef.current;
      if (!layer) return;
      const scrollY = window.scrollY || 0;
      const ranged = Math.min(Math.abs(scrollY), PARALLAX_RANGE_PX) / PARALLAX_RANGE_PX;
      // Two decimals without trailing zeros keeps the computed string clean.
      const offset = Math.round(maxPx * ranged * 100) / 100;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    /** Stops (or restarts) the effect when the OS motion preference flips. */
    function onPreferenceChange(event: MediaQueryListEvent) {
      if (event.matches) {
        document.removeEventListener("scroll", update);
        const layer = layerRef.current;
        if (layer) layer.style.transform = "";
      } else {
        document.addEventListener("scroll", update, { passive: true });
        update();
      }
    }

    // Captured while mounted (react-hooks rule): the layer node is stable for
    // the life of this effect, so the cleanup clears it without re-reading.
    const layer = layerRef.current;
    update();
    document.addEventListener("scroll", update, { passive: true });
    mediaQuery?.addEventListener?.("change", onPreferenceChange);
    return () => {
      document.removeEventListener("scroll", update);
      mediaQuery?.removeEventListener?.("change", onPreferenceChange);
      if (layer) layer.style.transform = "";
    };
  }, [maxPx]);

  return (
    <div ref={layerRef} data-parallax={maxPx} className={className}>
      {children}
    </div>
  );
}
