"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { featuredGitHubProjects } from "@/data/github";
import { fetchProjects } from "@/lib/api";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

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
          Cargando proyectos dinámicos…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-4">
        <ProjectItems projects={projects} />
        <p role="alert" className="rounded-md border border-line bg-paper-raised px-4 py-3 text-ink-muted">
          No se pudieron cargar los proyectos dinámicos. Mientras tanto, podés ver el proyecto destacado.
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
  // WU-B: tech-chip filter, single-select, chips = union of the featured
  // projects' technologies + a "Todas" reset chip.
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const technologies = featuredTechnologies();

  return (
    <div className="flex flex-col gap-5">
      <div
        role="group"
        aria-label="Filtrar proyectos por tecnología"
        className="flex flex-wrap gap-1.5"
      >
        <button
          type="button"
          aria-pressed={activeTech === null}
          onClick={() => setActiveTech(null)}
          className={chipClasses(activeTech === null)}
        >
          Todas
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
      <ol>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index + 1}
            attenuated={!cardMatchesTech(project, activeTech)}
          />
        ))}
      </ol>
    </div>
  );
}
