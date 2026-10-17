"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/types/project";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Sticky project showcase (portfolio-motion, showcase-sticky): a desktop-only
 * panel pinned beside the project list whose image follows the active project
 * — the list card whose center sits nearest the viewport center. Swaps use a
 * short fade/slide on a keyed remount layer (globals.css `preview-in`,
 * neutralized under reduced motion).
 *
 * Active tracking is cheap and repaint-safe: one scroll listener over the
 * namespaced `[data-project-card]` nodes set by ProjectList. Projects without
 * screenshots never lead the panel (they have nothing to preview — S5).
 */
export function ProjectShowcase({
  projects,
  onOpenPreview,
}: {
  projects: Project[];
  /** (project, event) — the event lets ProjectList return focus on close. */
  onOpenPreview: (project: Project, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const previewable = projects.filter(
    (project) => (project.images?.length ?? 0) > 0,
  );
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener?.("change", onChange);
    return () => mediaQuery.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    function update() {
      const nodes = document.querySelectorAll<HTMLElement>("[data-project-card]");
      if (nodes.length === 0 || previewable.length === 0) return;
      const ids = new Set(previewable.map((project) => project.id));
      const viewportCenter = (window.innerHeight || 1) / 2;
      let best = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      nodes.forEach((node) => {
        if (!ids.has(node.dataset.projectId ?? "")) return;
        const rect = node.getBoundingClientRect();
        const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (centerDistance < bestDistance) {
          bestDistance = centerDistance;
          best = Number(node.dataset.projectCard ?? -1);
        }
      });
      // `best` indexes the full projects list; map back into previewable.
      const id = best >= 0 ? nodes[best]?.dataset.projectId : undefined;
      const mapped = previewable.findIndex((project) => project.id === id);
      if (mapped >= 0) setActive(mapped);
    }

    update();
    document.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // Rects are remeasured per event; only list churn requires resubscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  const current = previewable[Math.min(active, previewable.length - 1)];
  if (!current?.images?.length) return null;
  const image = current.images[0];

  const layerClasses = reducedMotion
    ? "absolute inset-0"
    : "preview-layer-in absolute inset-0";

  return (
    <aside
      data-active-project={active}
      className="pointer-events-none relative hidden md:block md:sticky md:top-28 md:self-start"
    >
      {/* Panel duplicate of every card's "Vista previa" button, for the
          pointer users of the sticky panel. Distinct accessible name
          ("Ampliar …") so assistive tech and tests can tell them apart. */}
      <div className="pointer-events-auto relative aspect-[16/10] overflow-hidden rounded-md border border-line bg-paper-raised shadow-lg">
        <div key={current.id} data-showcase-layer="true" className={layerClasses}>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            sizes="(min-width: 768px) 320px"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-0.5 text-xs font-medium text-ink">
            {current.title}
          </span>
        </div>
        <button
          type="button"
          onClick={(event) => onOpenPreview(current, event)}
          aria-label={`Ampliar vista previa de ${current.title}`}
          className="absolute bottom-3 right-3 rounded-md bg-paper/90 px-3 py-1.5 text-sm font-medium text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
        >
          <span aria-hidden="true">Vista previa</span>
        </button>
      </div>
    </aside>
  );
}
