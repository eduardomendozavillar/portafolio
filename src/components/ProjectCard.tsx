import type { Project } from "@/types/project";

/**
 * Presentational project card with a numbered editorial index (01, 02, …).
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

  return (
    <li className="border-t border-line py-8 first:border-t-0 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
        <p className="font-display text-2xl font-semibold text-accent" aria-hidden="true">
          {number}
        </p>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold text-ink">
            {project.title}
          </h3>
          <p className="mt-2 leading-7 text-ink-muted">{project.summary}</p>

          {project.technologies.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-full border border-line px-3 py-1 text-xs text-ink"
                >
                  {technology}
                </li>
              ))}
            </ul>
          ) : null}

          {project.links && (project.links.demo || project.links.repo) ? (
            <ul className="mt-5 flex gap-5 text-sm font-medium">
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