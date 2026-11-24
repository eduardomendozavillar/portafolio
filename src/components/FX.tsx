"use client";

import { useEffect } from "react";

/**
 * Ambient interactivity layer (portfolio-rebrand 06): one delegated client
 * component that wires the artboard's pointer/scroll effects to the real
 * site — cursor spotlight on the header and on `[data-fx-spotlight]`
 * surfaces, 3D tilt + X-Y drift on `[data-fx-tilt-item]`, scroll parallax on
 * `.bg-figure` layers, and bidirectional staggered reveals on
 * `[data-fx-reveal]` — via document-level listeners and one IntersectionObserver.
 * Fully inert under prefers-reduced-motion.
 */
export function FX() {
  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer =
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) return;

    function onPointerMove(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Header spotlight: wash + per-link highlight following the cursor.
      const header = target.closest<HTMLElement>("header");
      if (header) {
        const rect = header.getBoundingClientRect();
        header.style.setProperty("--fx-hx", (event.clientX - rect.left).toFixed(0) + "px");
        header.style.setProperty("--fx-hy", (event.clientY - rect.top).toFixed(0) + "px");
        const link = target.closest<HTMLElement>("header nav a");
        if (link) {
          const lr = link.getBoundingClientRect();
          link.style.setProperty("--fx-lx", (event.clientX - lr.left).toFixed(0) + "px");
        }
      }

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

    function resetTilt(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      const tiltItem = target?.closest<HTMLElement>("[data-fx-tilt-item]");
      if (tiltItem) tiltItem.style.transform = "";
    }

    // Parallax suave de las figuras de fondo (gsap scroll-feel).
    const figures = Array.from(document.querySelectorAll<HTMLElement>(".bg-figure"));
    function onScroll() {
      const y = window.scrollY;
      figures.forEach((figure, i) => {
        figure.style.translate = "0 " + ((i % 2 ? -1 : 1) * y * (0.05 + i * 0.03)).toFixed(1) + "px";
      });
    }

    // Reveals escalonados bidireccionales por elemento.
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-fx-reveal]"),
    );
    revealTargets.forEach((el, i) => {
      el.dataset.fxOrder = String(i % 3);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("fx-in", entry.isIntersecting);
        });
      },
      { threshold: 0.18 },
    );
    revealTargets.forEach((el) => io.observe(el));

    if (finePointer) {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", resetTilt);
      document.addEventListener("pointerout", resetTilt);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", resetTilt);
      document.removeEventListener("pointerout", resetTilt);
      document.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return null;
}
