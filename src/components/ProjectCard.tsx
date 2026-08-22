import type { Project, ProjectStatus } from "@/types/project";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: "En producción",
  development: "En desarrollo",
  personal: "Personal",
};

/**
 * Presentational project row: index, title + status, outcome, tech, links.
 * Pure component — no hooks, safe to render from the client list.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const number = String(index).padStart(2, "0");
  const statusLabel = project.status ? STATUS_LABEL[project.status] : null;

  return (
    <li className="border-t border-line py-5 first:border-t-0 md:py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
        <p
          className="font-display text-xl font-semibold text-accent md:text-2xl"
          aria-hidden="true"
        >
          {number}
        </p>
        <div className="min-w-0 flex-1">
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
