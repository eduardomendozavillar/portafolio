import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectList } from "@/components/ProjectList";
import { githubActivity } from "@/data/github";

/** Proyectos: client section consuming GET /api/projects (design D1). */
export function Proyectos() {
  return (
    <section id="proyectos" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading
          index="03"
          title="Proyectos"
          description="Una selección de trabajos que muestran cómo resuelvo problemas reales con fundamentos sólidos."
        />
        <aside
          aria-labelledby="github-activity-title"
          className="mb-10 rounded-md border border-line bg-paper-raised p-5 md:mb-12 md:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h3
                id="github-activity-title"
                className="text-sm font-medium uppercase tracking-[0.2em] text-accent"
              >
                {githubActivity.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-ink-muted">
                Señales públicas curadas de mi trabajo reciente, sin depender de consultas en vivo al cargar la página.
              </p>
            </div>
            <a
              href={githubActivity.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              @{githubActivity.login}
            </a>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border-t border-line pt-4">
              <dt className="text-sm text-ink-muted">Repositorios públicos</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                {githubActivity.publicRepos}
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="text-sm text-ink-muted">Perfil activo desde</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                {githubActivity.since}
              </dd>
            </div>
          </dl>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-ink-muted">
            {githubActivity.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
        <ProjectList />
      </Container>
    </section>
  );
}
