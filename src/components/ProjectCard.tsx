import type { Project, ProjectStatus } from "@/types/project";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "En producción",
  development: "En desarrollo",
  personal: "Personal",
};

/**
 * Compact project row (portfolio-rebrand 14): the screenshot lives ONLY in
 * the sticky showcase panel — rows are number + title + summary + tags +
 * links, highlighted (filled number, row background) on hover and when the
 * showcase marks them active. `attenuated` (tech filter): reduced opacity,
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
      className={`project-card project-row rounded-lg px-4 py-4 transition-colors md:px-5 ${
        attenuated ? "opacity-50 saturate-50" : ""
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-5">
        <p
          className="row-num font-display text-3xl font-normal md:text-4xl"
          aria-hidden="true"
        >
          {number}
        </p>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl font-normal uppercase tracking-[0.02em] text-ink">
              {project.title}
            </h3>
            {statusLabel ? (
              <span
                className={`rounded-none px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.07em] ${
                  project.status === "production"
                    ? "bg-ink text-paper"
                    : "bg-cta text-cta-contrast"
                }`}
              >
                {statusLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[13.5px] leading-6 text-ink-muted">
            {project.summary}
          </p>

          {project.technologies.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11.5px]">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-md border border-line px-2.5 py-1 text-ink-muted"
                >
                  {technology}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-medium">
            {project.images && project.images.length > 0 && onPreview ? (
              <button
                type="button"
                onClick={onPreview}
                aria-label={`Vista previa de ${project.title}`}
                className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
              >
                Vista previa
              </button>
            ) : null}
            {project.links && (project.links.demo || project.links.repo) ? (
              <>
                {project.links.demo ? (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    Demo
                  </a>
                ) : null}
                {project.links.repo ? (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    Código
                  </a>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
