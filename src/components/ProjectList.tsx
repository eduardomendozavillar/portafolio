"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { featuredGitHubProjects } from "@/data/github";
import { fetchProjects } from "@/lib/api";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectLightbox } from "./ProjectLightbox";

/** Cursor offset so the floating preview never sits under the pointer. */
const PREVIEW_OFFSET_PX = 24;

/**
 * Floating preview target: hover-capable fine pointers only (desktop mice),
 * matching the Hero magnetic-CTA gate. Unknown matchMedia (very old or very
 * basic environments) wins the safe default: no floating preview.
 */
function hasHoverFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

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
  // portfolio-motion: decorative floating hover preview + preview lightbox.
  const [hoverProject, setHoverProject] = useState<Project | null>(null);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const finePointer = useState(() => hasHoverFinePointer())[0];
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const technologies = featuredTechnologies();
  const hoverCover = hoverProject?.images?.[0];

  const handlePointerEnter =
    (project: Project) => (event: React.PointerEvent<HTMLLIElement>) => {
      if (!finePointer) return;
      moveFloatingPreview(event);
      setHoverProject(project);
    };

  const handlePointerLeave = () => setHoverProject(null);

  const openLightbox =
    (project: Project) => (event: React.MouseEvent<HTMLButtonElement>) => {
      // Event handlers may read refs (house rule: never during render).
      previewTriggerRef.current = event.currentTarget;
      setHoverProject(null);
      setLightboxProject(project);
    };

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
            onPreview={
              project.images && project.images.length > 0
                ? openLightbox(project)
                : undefined
            }
            pointer={
              project.images && project.images.length > 0 && finePointer
                ? {
                    onPointerEnter: handlePointerEnter(project),
                    onPointerMove: moveFloatingPreview,
                    onPointerLeave: handlePointerLeave,
                  }
                : undefined
            }
          />
        ))}
      </ol>

      {finePointer && hoverCover ? <FloatingPreview image={hoverCover} /> : null}
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

/**
 * Decorative, aria-hidden floating screenshot near the cursor. Rendered only
 * while the pointer is over a row with screenshots on a hover-capable fine
 * pointer; position follows the cursor through CSS variables updated in the
 * pointer move handler (never re-rendered per move).
 */
function FloatingPreview({ image }: { image: NonNullable<Project["images"]>[number] }) {
  return (
    <div
      data-project-hover-preview="true"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{
        transform: "translate(var(--preview-x, 0px), var(--preview-y, 0px))",
      }}
    >
      <div
        className={
          "translate-x-6 -translate-y-1/2 overflow-hidden rounded-md border border-line " +
          "bg-paper shadow-lg transition-opacity duration-150 [transition-delay:80ms] " +
          "motion-reduce:transition-none"
        }
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt=""
          sizes="320px"
          className="h-auto w-80 object-cover"
        />
      </div>
    </div>
  );
}

/**
 * Tracks the cursor through root CSS custom properties. Values fall back to
 * 0px (top-left corner) in environments without real pointerevent coords,
 * which is only ever the case in tests and non-hover media.
 */
function moveFloatingPreview(event: React.PointerEvent<HTMLLIElement>) {
  if (typeof document === "undefined" || typeof event.clientX !== "number") return;
  const x = event.clientX + PREVIEW_OFFSET_PX;
  const y = event.clientY;
  document.documentElement.style.setProperty("--preview-x", `${x.toFixed(0)}px`);
  document.documentElement.style.setProperty("--preview-y", `${Math.max(y, PREVIEW_OFFSET_PX).toFixed(0)}px`);
}
