"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fetchProjects } from "@/lib/api";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

type Status = "loading" | "success" | "error";

/**
 * Client project list with the Spanish states required by the
 * projects-content spec: loading indicator, empty state, and an error
 * message that never blocks the rest of the page.
 */
export function ProjectList() {
  const [status, setStatus] = useState<Status>("loading");
  const [projects, setProjects] = useState<Project[]>([]);

  function retry() {
    setStatus("loading");
    void loadProjects();
  }

  // Fetch on mount. setState only inside promise callbacks (subscription
  // pattern) — never synchronously in the effect body (react-hooks lint).
  function loadProjects() {
    return fetchProjects()
      .then((data) => {
        setProjects(data);
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
      });
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  if (status === "loading") {
    return (
      <p
        role="status"
        className="flex items-center gap-3 text-ink-muted"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-teal"
        />
        Cargando proyectos…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-4">
        <p role="alert" className="rounded-md border border-line bg-white px-4 py-3 text-ink-muted">
          No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.
        </p>
        <Button variant="outline" onClick={retry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p role="status" className="rounded-md border border-dashed border-line px-4 py-8 text-center text-ink-muted">
        Todavía no hay proyectos publicados. Vuelve pronto.
      </p>
    );
  }

  return (
    <ol>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index + 1} />
      ))}
    </ol>
  );
}