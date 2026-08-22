import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectList } from "@/components/ProjectList";
import { githubActivity } from "@/data/github";

/** Proyectos: client section consuming GET /api/projects (design D1). */
export function Proyectos() {
  return (
    <section id="proyectos" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title="Proyectos"
          description="Una selección de trabajos que muestran cómo resuelvo problemas reales con fundamentos sólidos."
        />
        <aside
          aria-labelledby="github-activity-title"
          className="mb-8 flex flex-col gap-3 rounded-md border border-line bg-paper-raised px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2 md:mb-10"
        >
          <h3
            id="github-activity-title"
            className="text-sm font-medium uppercase tracking-[0.2em] text-accent"
          >
            {githubActivity.title}
          </h3>
          <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm text-ink-muted">
            <div className="flex items-baseline gap-2">
              <dt>Repos públicos</dt>
              <dd className="font-display text-lg font-semibold text-ink">
                {githubActivity.publicRepos}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt>Desde</dt>
              <dd className="font-display text-lg font-semibold text-ink">
                {githubActivity.since}
              </dd>
            </div>
          </dl>
          <a
            href={githubActivity.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            @{githubActivity.login}
          </a>
        </aside>
        <ProjectList />
      </Container>
    </section>
  );
}
