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

const STATUS_LABEL: Record<string, string> = {
  production: "En producción",
  development: "En desarrollo",
  personal: "Personal",
};

/**
 * Sticky project showcase (portfolio-rebrand 14): the ONLY preview — a panel
 * pinned beside the compact rows showing the active project's screenshot
 * (last card whose top crossed the 35% reading line; holds while the list is
 * visible, retracts before it). Plus layer: ambient glow, corner notch,
 * progress dots, barber action buttons and a terminal line.
 * Swaps use a keyed remount layer (globals.css `preview-in`), neutralized
 * under reduced motion. Projects without screenshots never lead the panel.
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
      const viewportHeight = window.innerHeight || 1;
      // La lista solo está "por debajo" si todas sus cards empiezan tras el
      // viewport (el usuario todavía no llegó): ahí el panel se retrae.
      const listBelow = Array.from(nodes).every(
        (node) => node.getBoundingClientRect().top >= viewportHeight,
      );
      if (listBelow) {
        setActive(-1);
        return;
      }
      // Scrollspy alineado a la vista: el activo es la PRIMERA card aún
      // visible desde arriba (su borde inferior no pasó el borde superior del
      // viewport). Baja → instala la siguiente cuando la anterior sale;
      // sube → vuelve a la anterior. Si toda la lista ya quedó arriba, el
      // último proyecto sostiene el panel.
      let firstVisible = -1;
      nodes.forEach((node, index) => {
        if (firstVisible >= 0) return;
        if (!ids.has(node.dataset.projectId ?? "")) return;
        if (node.getBoundingClientRect().bottom <= 0) return;
        firstVisible = index;
      });
      const id = firstVisible >= 0 ? nodes[firstVisible]?.dataset.projectId : undefined;
      const mapped = previewable.findIndex((project) => project.id === id);
      if (mapped >= 0) {
        setActive(mapped);
      } else if (nodes[0].getBoundingClientRect().bottom < 0) {
        // Toda la lista ya quedó arriba (scroll pasado): el último sostiene.
        setActive(previewable.length - 1);
      } else {
        setActive((currentActive) => (currentActive >= 0 ? currentActive : 0));
      }
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

  const current = active >= 0 ? previewable[active] : undefined;

  // Nothing crossed the line yet: the panel retracts (no stale cover, no
  // controls, just a quiet hint). It re-installs as soon as the user scrolls
  // into the first project card.
  if (!current?.images?.length) {
    return (
      <aside
        data-active-project={-1}
        className="relative hidden md:block md:sticky md:top-28 md:self-start"
      >
        <div
          data-showcase-retracted="true"
          className={
            (reducedMotion ? "absolute inset-0" : "preview-retract absolute inset-0") +
            " grid place-items-center rounded-md border border-dashed border-line bg-paper-raised text-xs text-ink-muted"
          }
        >
          <span aria-hidden="true">Las vistas de los proyectos aparecen acá</span>
        </div>
      </aside>
    );
  }

  const image = current.images[0];

  const layerClasses = reducedMotion
    ? ""
    : "preview-layer-in";

  return (
    <aside
      data-active-project={active}
      className="pointer-events-none relative hidden md:block md:sticky md:top-28 md:self-start"
    >
      <div className="pointer-events-auto relative rounded-md border border-line bg-paper-raised shadow-[0_24px_70px_-30px_rgba(179,38,30,0.45)]">
        {/* Notch barber en la esquina superior derecha. */}
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-3 h-6 w-6 rounded-tr-md border-r-[3px] border-t-[3px] border-accent"
        />
        {/* Dots: cuál de los proyectos está mostrando el panel. */}
        <div className="flex gap-1.5 px-4 pt-3.5" aria-hidden="true">
          {previewable.map((project, index) => (
            <span
              key={project.id}
              className={`h-1 w-6 rounded-full ${index === active ? "bg-accent" : "bg-line"}`}
            />
          ))}
        </div>
        <div
          key={current.id}
          data-showcase-layer="true"
          className={layerClasses}
        >
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            sizes="(min-width: 768px) 420px"
            className="h-auto w-full object-cover object-top"
          />
        </div>
        <div className="relative border-t border-line px-4 pb-4 pt-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
            {STATUS_LABEL[current.status ?? "development"] ?? "Proyecto"}
          </p>
          <p className="mt-1 text-[15px] font-bold text-ink">{current.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
            {current.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={(event) => onOpenPreview(current, event)}
              className="rounded-none bg-cta px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-cta-contrast [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)]"
            >
              Vista previa
            </button>
            {current.links?.demo ? (
              <a
                href={current.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-none bg-ink px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-paper [clip-path:polygon(7px_0,100%_0,100%_calc(100%-7px),calc(100%-7px)_100%,0_100%,0_7px)]"
              >
                Ver en vivo
              </a>
            ) : null}
          </div>
          <p className="mt-3 border-t border-line pt-2 font-mono text-[11px] text-ink-muted">
            <span className="text-accent">eduardo@portfolio:~$</span> activo:{" "}
            {current.slug ?? current.id}
          </p>
        </div>
      </div>
    </aside>
  );
}
