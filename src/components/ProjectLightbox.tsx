"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/types/project";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const FOCUSABLE =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Project preview lightbox (portfolio-motion): a recruiter-facing dialog with
 * the project's screenshot gallery, summary, tech chips and links. Same
 * discipline as the command palette: focus trapped while open, Esc /
 * overlay-click to close with focus returned to the opener button, body
 * scroll locked, and no animation under prefers-reduced-motion.
 *
 * Rendered conditionally (unmount-to-close) so gallery index state resets
 * naturally on every open.
 */
export function ProjectLightbox({
  project,
  onClose,
  triggerRef,
}: {
  project: Project;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const images = project.images ?? [];
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [entered, setEntered] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener?.("change", onChange);
    return () => mediaQuery.removeEventListener?.("change", onChange);
  }, []);

  /** Focus the dialog (close button) as soon as it mounts. */
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
    // Capture the opener button while it is mounted: returning focus in the
    // cleanup keeps the "every unmount is a real close" rule without reading
    // the (possibly stale) ref when the effect ends.
    const opener = triggerRef?.current;
    return () => {
      opener?.focus();
    };
    // The opener stays stable for the life of this unmount-on-close dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Entrance transition (skipped entirely under reduced motion). */
  useEffect(() => {
    if (reducedMotion) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  /** Body scroll lock while the lightbox is open. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /** Global keys: Escape closes, arrows navigate the gallery. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) => (current - 1 + images.length) % images.length);
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [images.length, onClose]);

  const goPrev = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const goNext = () => setIndex((current) => (current + 1) % images.length);

  const image = images[Math.min(index, images.length - 1)];
  // Single text node so RTL/test text queries match the counter exactly.
  const counter = `${Math.min(index, images.length - 1) + 1} / ${images.length}`;

  const overlayClasses = reducedMotion
    ? "fixed inset-0 z-[60] bg-paper/80 backdrop-blur-sm"
    : `fixed inset-0 z-[60] bg-paper/80 backdrop-blur-sm transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`;
  // max-h + overflow-y: short viewports must be able to reach every control
  // (the dialog scrolls its own content; the body scroll stays locked).
  const dialogClasses = reducedMotion
    ? "fixed left-1/2 top-1/2 z-[61] max-h-[92vh] w-[min(94vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border border-line bg-paper-raised p-5 shadow-2xl md:p-6"
    : `fixed left-1/2 top-1/2 z-[61] max-h-[92vh] w-[min(94vw,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border border-line bg-paper-raised p-5 shadow-2xl transition-[opacity,transform] duration-200 md:p-6 ${
        entered ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
      }`;

  // Portal to <body>: this component is rendered deep inside the projects
  // section's Reveal wrapper — a transform ancestor, which (per CSS spec)
  // becomes the containing block for fixed descendants. Without the portal,
  // top-50%/translate centered the dialog against the SECTION, dropping half
  // of it below the fold. Portaling restores true viewport anchoring.
  return createPortal(
    <div
      className={overlayClasses}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Vista previa de ${project.title}`}
        className={dialogClasses}
        onKeyDown={(event) => {
          // Focus trap: Tab wraps inside the dialog (palette discipline).
          if (event.key !== "Tab" || !dialogRef.current) return;
          const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-ink md:text-xl">
            {project.title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-ink-muted underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Cerrar
          </button>
        </div>

        {image ? (
          <div className="mt-4 overflow-hidden rounded-md border border-line bg-paper">
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={`Captura ${index + 1} de ${project.title}`}
              sizes="(max-width: 56rem) 100vw, 50rem"
              className="mx-auto h-auto max-h-[50vh] w-full object-contain"
            />
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={goPrev}
              className="font-medium text-ink-muted transition-colors hover:text-accent"
            >
              <span aria-hidden="true">‹ </span>Anterior
            </button>
            <p className="text-ink-muted" aria-live="polite">
              {counter}
            </p>
            <button
              type="button"
              onClick={goNext}
              className="font-medium text-ink-muted transition-colors hover:text-accent"
            >
              Siguiente<span aria-hidden="true"> ›</span>
            </button>
          </div>
        ) : null}

        <p className="mt-4 leading-7 text-ink-muted">{project.summary}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink"
            >
              {technology}
            </li>
          ))}
        </ul>

        {project.links && (project.links.demo || project.links.repo) ? (
          <ul className="mt-4 flex gap-5 text-sm font-medium">
            {project.links.demo ? (
              <li>
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Demo
                </a>
              </li>
            ) : null}
            {project.links.repo ? (
              <li>
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  Código
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
