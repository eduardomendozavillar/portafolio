import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Project, ProjectStatus } from "@/types/project";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "En producción",
  development: "En desarrollo",
  personal: "Personal",
};

/**
 * Presentational project row: index, title + status, outcome, tech, links.
 * Pure component — no hooks, safe to render from the client list.
 *
 * `attenuated` (WU-B filter): reduced opacity + slight desaturate via the
 * `data-filtered` hook; the card stays visible and its links stay focusable —
 * never hidden or aria-hidden.
 */
export function ProjectCard({
  project,
  index,
  attenuated = false,
  onPreview,
}: {
  project: Project;
  index: number;
  attenuated?: boolean;
  /** Opens the project lightbox; only rendered when screenshots exist. */
  onPreview?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const number = String(index).padStart(2, "0");
  const statusLabel = project.status ? STATUS_LABEL[project.status] : null;

  return (
    <li
      data-filtered={attenuated ? "true" : undefined}
      /* Showcase hooks (portfolio-motion): the sticky panel tracks the card
         nearest the viewport center through these document-wide attributes. */
      data-project-card={index - 1}
      data-project-id={project.id}
      className={`project-card px-5 py-5 md:py-6 ${
        attenuated ? "opacity-50 saturate-50" : ""
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
        <p
          className="font-display text-xl font-semibold text-accent md:text-2xl"
          aria-hidden="true"
        >
          {number}
        </p>
        <div className="min-w-0 flex-1">
          {/* Capturas protagonistas (rebrand 10): la captura real ocupa el
             protagonismo en todas las medidas, con overlay de acciones
             rápidas al hover (decorativo para AT: los links reales siguen
             visibles en el cuerpo de la card). */}
          {project.images && project.images.length > 0 ? (
            <div className="shotbox relative mb-4 overflow-hidden rounded-lg border border-line bg-black/30">
              <Image
                src={project.images[0].src}
                width={project.images[0].width}
                height={project.images[0].height}
                alt=""
                sizes="(min-width: 768px) 520px, 100vw"
                className="h-auto max-h-52 w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-2.5 bg-gradient-to-t from-black/85 via-black/25 to-transparent pb-4 opacity-0 transition-[opacity,translate] duration-200 translate-y-3 group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-hover/card:translate-y-0">
                {project.links?.demo ? (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto rounded-md bg-ink px-3.5 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.05em] text-paper"
                  >
                    Ver en vivo
                  </a>
                ) : null}
                {project.links?.repo ? (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto rounded-md border border-ink/40 px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-[0.05em] text-ink"
                  >
                    Código
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl font-semibold text-ink">
              {project.title}
            </h3>
            {statusLabel ? (
              <span className="rounded-full border border-line bg-paper-raised px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                {statusLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 leading-7 text-ink-muted">{project.summary}</p>

          {project.technologies.length > 0 ? (
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
          ) : null}

          {project.images && project.images.length > 0 && onPreview ? (
            <ul className="mt-4 flex gap-5 text-sm font-medium">
              <li>
                <button
                  type="button"
                  onClick={onPreview}
                  aria-label={`Vista previa de ${project.title}`}
                  className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Vista previa
                </button>
              </li>
            </ul>
          ) : null}

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
      </div>
    </li>
  );
}
