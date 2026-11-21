"use client";

import { useEffect } from "react";

/**
 * Ambient interactivity layer (portfolio-rebrand 06): one delegated client
 * component that wires the artboard's pointer effects to the real site —
 * 3D tilt + X-Y drift on `[data-fx-tilt-item]` and a cursor-following
 * spotlight on `[data-fx-spotlight]` — via two document-level listeners.
 * Fully inert under prefers-reduced-motion.
 */
export function FX() {
  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (typeof window.matchMedia === "function" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    function onPointerMove(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const tiltItem = target.closest<HTMLElement>("[data-fx-tilt-item]");
      if (tiltItem) {
        const rect = tiltItem.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tiltItem.style.transform =
          "translate(" + (x * 10).toFixed(1) + "px, " + (y * 10).toFixed(1) + "px)" +
          " rotateX(" + (-y * 9).toFixed(1) + "deg) rotateY(" + (x * 11).toFixed(1) + "deg)";
      }

      const spotlight = target.closest<HTMLElement>("[data-fx-spotlight]");
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect();
        spotlight.style.setProperty("--fx-x", (event.clientX - rect.left).toFixed(0) + "px");
        spotlight.style.setProperty("--fx-y", (event.clientY - rect.top).toFixed(0) + "px");
      }
    }

    function resetTransform(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const tiltItem = target?.closest<HTMLElement>("[data-fx-tilt-item]");
      if (tiltItem) tiltItem.style.transform = "";
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", resetTransform);
    document.addEventListener("pointerout", resetTransform);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", resetTransform);
      document.removeEventListener("pointerout", resetTransform);
    };
  }, []);

  return null;
}
