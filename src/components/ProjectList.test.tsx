// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectList } from "./ProjectList";
import type { Project } from "@/types/project";

/**
 * RTL suite for ProjectList (task 4.3) — loading / empty / error + Reintentar,
 * and numbered project rendering. The fetch client is mocked at the fetch
 * boundary (same pattern as src/lib/api.test.ts).
 *
 * WU-B adds the tech-chip filter suite: chips render from the union of the
 * featured projects' technologies; selecting a chip attenuates (never hides)
 * non-matching cards via the `data-filtered="true"` hook + opacity classes.
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

  it("shows Spanish status badges for featured projects and omits them when unset", async () => {
    mockProjectsResponse([
      project({
        id: "c",
        title: "Gamma sin estado",
        sortOrder: 3,
      }),
    ]);
    render(<ProjectList />);

    expect(await screen.findByText("Portafolio personal")).toBeTruthy();
    expect(screen.getByText("En producción")).toBeTruthy();
    expect(screen.getAllByText("En desarrollo").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Gamma sin estado")).toBeTruthy();
    expect(screen.queryByText("Personal")).toBeNull();
  });

  it("renders tech filter chips from the union of featured technologies plus a Todas reset chip", async () => {
    mockProjectsResponse([]);
    render(<ProjectList />);

    expect(await screen.findByText("Portafolio personal")).toBeTruthy();

    const group = screen.getByRole("group", {
      name: "Filtrar proyectos por tecnología",
    });
    expect(group).toBeTruthy();

    // Union of technologies across the featured projects (src/data/github.ts).
    const featuredTechs = [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Firebase",
      "Vercel",
      "React",
      "Vite",
      "Express",
      "PostgreSQL",
      "Gemini",
      "Firestore",
      "Auth.js",
      "Prisma",
      "SQLite",
    ];
    for (const tech of featuredTechs) {
      expect(screen.getByRole("button", { name: tech })).toBeTruthy();
    }

    // Reset chip exists and starts pressed (no filter active).
    expect(
      screen.getByRole("button", { name: "Todas" }).getAttribute("aria-pressed"),
    ).toBe("true");
    for (const tech of featuredTechs) {
      expect(
        screen.getByRole("button", { name: tech }).getAttribute("aria-pressed"),
      ).toBe("false");
    }
  });

  it("attenuates non-matching cards when a chip is active and restores on second click", async () => {
    mockProjectsResponse([]);
    render(<ProjectList />);

    expect(await screen.findByText("taller.by")).toBeTruthy();

    // Only taller.by uses Gemini: the other three featured cards attenuate.
    fireEvent.click(screen.getByRole("button", { name: "Gemini" }));

    expect(
      screen.getByRole("button", { name: "Gemini" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Todas" }).getAttribute("aria-pressed"),
    ).toBe("false");

    const tallerCard = screen.getByText("taller.by").closest("li");
    const sgdiCard = screen
      .getByText("SGDI — Ventanilla Única de Radicación")
      .closest("li");
    expect(tallerCard?.getAttribute("data-filtered")).toBeNull();
    expect(sgdiCard?.getAttribute("data-filtered")).toBe("true");
    expect(sgdiCard?.className).toContain("opacity-50");

    // Attenuated cards are never removed: their links remain in the document.
    expect(screen.getAllByRole("link", { name: "Demo" }).length).toBeGreaterThan(0);

    // Single-select toggle: clicking the active chip again deselects it.
    fireEvent.click(screen.getByRole("button", { name: "Gemini" }));
    expect(
      screen.getByRole("button", { name: "Gemini" }).getAttribute("aria-pressed"),
    ).toBe("false");
    expect(document.querySelectorAll('[data-filtered="true"]').length).toBe(0);
  });

  it("restores every card through the Todas reset chip", async () => {
    mockProjectsResponse([]);
    render(<ProjectList />);

    expect(await screen.findByText("taller.by")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Next.js" }));
    // Next.js matches Portafolio personal and SGDI only.
    expect(document.querySelectorAll('[data-filtered="true"]').length).toBe(2);

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(document.querySelectorAll('[data-filtered="true"]').length).toBe(0);
    expect(
      screen.getByRole("button", { name: "Todas" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
