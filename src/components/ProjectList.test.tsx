// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectList } from "./ProjectList";
import type { Project } from "@/types/project";

/**
 * RTL suite for ProjectList (task 4.3) — loading / empty / error + Reintentar,
 * and numbered project rendering. The fetch client is mocked at the fetch
 * boundary (same pattern as src/lib/api.test.ts).
 */

const originalFetch = globalThis.fetch;

function project(
  overrides: Partial<Project> & { id: string; title: string },
): Project {
  return {
    summary: "Resumen corto.",
    description: "Descripción larga.",
    technologies: ["React"],
    featured: false,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const projects: Project[] = [
  project({
    id: "a",
    title: "Alpha",
    sortOrder: 1,
    links: { demo: "https://demo.example.com/alpha" },
  }),
  project({
    id: "b",
    title: "Beta",
    sortOrder: 2,
    technologies: ["Next.js", "TypeScript"],
    links: { repo: "https://github.com/example/beta" },
  }),
];

function mockProjectsResponse(list: Project[]) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => list,
  }) as unknown as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("ProjectList", () => {
  it("shows the Spanish loading indicator while fetching", () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}),
    ) as unknown as typeof fetch;

    render(<ProjectList />);

    expect(screen.getByText("Portafolio personal")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("Cargando proyectos dinámicos");
    expect(vi.mocked(globalThis.fetch)).toHaveBeenCalledWith("/api/projects", {
      cache: "no-store",
    });
  });

  it("renders the featured project when there are no remote projects", async () => {
    mockProjectsResponse([]);
    render(<ProjectList />);

    expect(await screen.findByText("Portafolio personal")).toBeTruthy();
    expect(screen.queryByText(/Todavía no hay proyectos publicados/)).toBeNull();
  });

  it("shows the Spanish error state and recovers via Reintentar", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => projects,
      }) as unknown as typeof fetch;

    render(<ProjectList />);

    const alert = await screen.findByRole("alert");
    expect(screen.getByText("Portafolio personal")).toBeTruthy();
    expect(alert.textContent).toContain("No se pudieron cargar los proyectos dinámicos");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Portafolio personal")).toBeTruthy();
    expect(vi.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
  });

  it("renders projects in order with numbered indexes and links", async () => {
    mockProjectsResponse(projects);
    render(<ProjectList />);

    expect(await screen.findByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Portafolio personal")).toBeTruthy();

    // Numbered editorial index (aria-hidden) 01 / 02…
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("02")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();

    // Tech chips.
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);

    // External links.
    expect(
      screen
        .getAllByRole("link", { name: "Demo" })
        .some((link) => link.getAttribute("href") === "https://portafolio-psi-five-95.vercel.app"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: "Código" })
        .some((link) => link.getAttribute("href") === "https://github.com/eduardomendozavillar/portafolio"),
    ).toBe(true);
  });

  it("does not duplicate the featured project when the API returns it", async () => {
    mockProjectsResponse([
      project({
        id: "remote-portfolio",
        title: "Portafolio personal",
        links: { repo: "https://github.com/eduardomendozavillar/portafolio" },
      }),
    ]);

    render(<ProjectList />);

    expect(await screen.findAllByText("Portafolio personal")).toHaveLength(1);
  });
});
