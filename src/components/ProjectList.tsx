"use client";

import { useEffect, useRef, useState , useMemo} from "react";
import { Button } from "@/components/ui/Button";
import { featuredGitHubProjects } from "@/data/github";
import { fetchProjects } from "@/lib/api";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectLightbox } from "./ProjectLightbox";
import { ProjectShowcase } from "./ProjectShowcase";
import { useLang, useT } from "@/i18n/LanguageProvider";
import { pickLocalized } from "@/i18n/localize";

type Status = "loading" | "success" | "error";

/**
 * Union of technologies across the featured projects (WU-B): the chip row
 * is derived purely from data, in first-appearance order.
 */
function featuredTechnologies() {
  const seen = new Set<string>();
  for (const project of featuredGitHubProjects) {
    for (const technology of project.technologies) {
      seen.add(technology);
    }
  }
  return [...seen];
}

function chipClasses(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs font-medium",
    "transition-colors duration-150",
    active
      ? "border-accent bg-accent-soft text-accent"
      : "border-line text-ink-muted hover:border-accent hover:text-ink",
  ].join(" ");
}

function cardMatchesTech(project: Project, activeTech: string | null) {
  if (activeTech === null) return true;
  const needle = activeTech.toLowerCase();
  return project.technologies.some(
    (technology) => technology.toLowerCase() === needle,
  );
}

function cardMatchesEstado(
  project: Project,
  activeEstado: "todas" | "production" | "development",
) {
  if (activeEstado === "todas") return true;
  return project.status === activeEstado;
}

function projectIdentity(project: Project) {
  return [
    project.links?.repo?.toLowerCase(),
    project.links?.demo?.toLowerCase(),
    project.title.toLowerCase(),
  ].filter(Boolean);
}

function mergeFeaturedProjects(remoteProjects: Project[]) {
  const remoteIdentities = new Set(remoteProjects.flatMap(projectIdentity));
  const uniqueFeaturedProjects = featuredGitHubProjects.filter(
    (project) => !projectIdentity(project).some((identity) => remoteIdentities.has(identity)),
  );

  return [...uniqueFeaturedProjects, ...remoteProjects];
}

/**
 * Client project list with the Spanish states required by the
 * projects-content spec: loading indicator, empty state, and an error
 * message that never blocks the rest of the page.
 */
export function ProjectList() {
  const t = useT();
  const [status, setStatus] = useState<Status>("loading");
  const [projects, setProjects] = useState<Project[]>(featuredGitHubProjects);

  function retry() {
    setStatus("loading");
    void loadProjects();
  }

  // Fetch on mount. setState only inside promise callbacks (subscription
  // pattern) — never synchronously in the effect body (react-hooks lint).
  function loadProjects() {
    return fetchProjects()
      .then((data) => {
        setProjects(mergeFeaturedProjects(data));
        setStatus("success");
      })
      .catch(() => {
        setProjects(featuredGitHubProjects);
        setStatus("error");
      });
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <ProjectItems projects={projects} />
        <p
          role="status"
          className="flex items-center gap-3 text-ink-muted"
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent"
          />
          {t.sections.projects.states.loading}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-4">
        <ProjectItems projects={projects} />
        <p role="alert" className="rounded-md border border-line bg-paper-raised px-4 py-3 text-ink-muted">
          {t.sections.projects.states.error}
        </p>
        <Button variant="outline" onClick={retry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p role="status" className="rounded-md border border-dashed border-line bg-paper-raised px-4 py-8 text-center text-ink-muted">
        Todavía no hay proyectos publicados. Vuelve pronto.
      </p>
    );
  }

  return (
    <ProjectItems projects={projects} />
  );
}

function ProjectItems({ projects }: { projects: Project[] }) {
  const t = useT();
  const { lang } = useLang();
  const localized = useMemo(
    () => projects.map((project) => pickLocalized(project, lang)),
    [projects, lang],
  );
  // WU-B: tech-chip filter, single-select, chips = union of the featured
  // projects' technologies + a "Todas" reset chip.
  const [activeTech, setActiveTech] = useState<string | null>(null);
  // Rebrand 10: maturity filter (Capturas protagonistas artboard) combined
  // with the tech filter — a card shows when it passes both.
  const [activeEstado, setActiveEstado] = useState<"todas" | "production" | "development">("todas");
  // portfolio-motion: sticky showcase panel + preview lightbox.
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const technologies = featuredTechnologies();

  const openLightbox =
    (project: Project) => (event: React.MouseEvent<HTMLButtonElement>) => {
      // Event handlers may read refs (house rule: never during render).
      previewTriggerRef.current = event.currentTarget;
      setLightboxProject(project);
    };

  const openFromShowcase =
    (project: Project, event: React.MouseEvent<HTMLButtonElement>) => {
      previewTriggerRef.current = event.currentTarget;
      setLightboxProject(project);
    };

  const prodCount = localized.filter((project) => project.status === "production").length;
  const devCount = localized.filter((project) => project.status === "development").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen (rebrand 10 · capturas protagonistas). */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-paper-raised px-5 py-3.5 text-[13px] text-ink-muted">
        <span><b className="font-display text-2xl font-normal text-accent">{localized.length}</b> {t.sections.projects.count.projects}</span>
        <span><b className="font-display text-2xl font-normal text-accent">{prodCount}</b> {t.sections.projects.count.production}</span>
        <span><b className="font-display text-2xl font-normal text-accent">{devCount}</b> {t.sections.projects.count.development}</span>
      </div>
      {/* Filtro por madurez (rebrand 10). */}
      <div
        role="group"
        aria-label={t.sections.projects.filterState}
        className="flex flex-wrap gap-1.5"
      >
        {(
          [
            { label: t.sections.projects.all, value: "todas" },
            { label: t.sections.projects.production, value: "production" },
            { label: t.sections.projects.development, value: "development" },
          ] as const
        ).map((chip) => (
          <button
            key={chip.value}
            type="button"
            aria-pressed={activeEstado === chip.value}
            onClick={() => setActiveEstado(chip.value)}
            className={chipClasses(activeEstado === chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label={t.sections.projects.filterTech}
        className="flex flex-wrap gap-1.5"
      >
        <button
          type="button"
          aria-pressed={activeTech === null}
          onClick={() => setActiveTech(null)}
          className={chipClasses(activeTech === null)}
        >
          {t.sections.projects.all}
        </button>
        {technologies.map((technology) => (
          <button
            key={technology}
            type="button"
            aria-pressed={activeTech === technology}
            onClick={() =>
              setActiveTech(activeTech === technology ? null : technology)
            }
            className={chipClasses(activeTech === technology)}
          >
            {technology}
          </button>
        ))}
      </div>
      {/* Showcase-sticky panel (desktop) beside the scroll-tracked list. */}
      <div className="gap-10 md:grid md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <ProjectShowcase
          projects={localized}
          onOpenPreview={openFromShowcase}
        />
        <ol className="space-y-4">
          {localized.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index + 1}
              attenuated={!cardMatchesTech(project, activeTech) || !cardMatchesEstado(project, activeEstado)}
              onPreview={
                project.images && project.images.length > 0
                  ? openLightbox(project)
                  : undefined
              }
            />
          ))}
        </ol>
      </div>
      {lightboxProject ? (
        <ProjectLightbox
          key={lightboxProject.id}
          project={lightboxProject}
          onClose={() => setLightboxProject(null)}
          triggerRef={previewTriggerRef}
        />
      ) : null}
    </div>
  );
}
