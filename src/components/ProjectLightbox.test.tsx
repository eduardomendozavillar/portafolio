// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectLightbox } from "./ProjectLightbox";
import type { Project } from "@/types/project";

/**
 * RTL suite for ProjectLightbox (portfolio-motion T4): gallery navigation,
 * Esc/overlay close, Demo/Código links, body scroll lock while open, and
 * keyboard access for the "Vista previa" affordance rendered by ProjectCard.
 */

function project(overrides: Partial<Project>): Project {
  return {
    id: "test",
    title: "Proyecto Demo",
    summary: "Resumen corto.",
    description: "Descripción larga.",
    technologies: ["React", "TypeScript"],
    featured: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    images: [
      { src: "/images/projects/test/test-01.webp", width: 800, height: 500 },
      { src: "/images/projects/test/test-02.webp", width: 800, height: 500 },
    ],
    ...overrides,
  };
}

const baseProject = project({});
const onOpenChanged = vi.fn();
const triggerRef = { current: null };

function renderLightbox(project: Project = baseProject) {
  return render(
    <ProjectLightbox project={project} onClose={onOpenChanged} triggerRef={undefined as never} />,
  );
}

beforeEach(() => {
  onOpenChanged.mockClear();
  triggerRef.current = null;
});

describe("ProjectLightbox", () => {
  it("renders the project dialog with cover image, counter and meta", () => {
    renderLightbox();

    expect(document.querySelector('body > div.fixed [role="dialog"]')).toBeTruthy();
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("1 / 2")).toBeTruthy();
    expect((screen.getByRole("img").getAttribute("src") ?? "").includes("test-01")).toBe(true);
    expect(screen.getByText("Resumen corto.")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
  });

  it("shows Demo and Código links when the project provides them", () => {
    const withLinks = project({
      links: { demo: "https://demo.example.com", repo: "https://github.com/example/repo" },
    });
    const { container } = render(<ProjectLightbox project={withLinks} onClose={onOpenChanged} />);

    expect(screen.getByText("Demo").getAttribute("href")).toBe("https://demo.example.com");
    expect(screen.getByText("Código").getAttribute("href")).toBe("https://github.com/example/repo");
    expect(container).toBeDefined();
  });

  it("cycles the gallery with anterior/siguiente and wraps around", () => {
    renderLightbox();

    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.getByText("2 / 2")).toBeTruthy();
    fireEvent.click(screen.getByText("Siguiente"));
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.click(screen.getByText("Anterior"));
    expect(screen.getByText("2 / 2")).toBeTruthy();
  });

  it("navigates with ArrowLeft / ArrowRight and closes with Escape", () => {
    const { container } = renderLightbox();

    // Key events are listened on document (capture); keydowns in real browsers
    // bubble from the focused element up to document, so targets match.
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByText("2 / 2")).toBeTruthy();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("1 / 2")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChanged).toHaveBeenCalledTimes(1);
    expect(container).toBeDefined();
  });

  it("mounts into document.body so fixed positioning is not trapped by transformed ancestors", () => {
    // Regression (production report): rendered inside the section's Reveal
    // wrapper (a transform ancestor), the fixed overlay/dialog resolved
    // percentages against the section — the dialog landed mid-page, half
    // below the fold. Portaling to <body> restores viewport anchoring.
    const { baseElement } = renderLightbox();

    const overlay = baseElement.querySelector("body > div.fixed") ?? document.querySelector("body > div.fixed");
    expect(overlay).toBeTruthy();
    expect(overlay?.parentElement).toBe(document.body);
  });

  it("locks body scroll while open", () => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "";

    renderLightbox();

    expect(document.body.style.overflow).toBe("hidden");

    document.body.style.overflow = previous;
  });

  it("fits the viewport: dialog scrolls itself and the image stays bounded", () => {
    // Regression (user report): on short viewports the dialog grew taller
    // than the screen — pagination controls were unreachable and the page
    // could not scroll. The dialog must cap its height and scroll its own
    // content; the image must shrink inside it.
    renderLightbox();
    const dialog = document.querySelector('body > div.fixed [role="dialog"]') as HTMLElement;

    expect(dialog.className).toContain("max-h-[92vh]");
    expect(dialog.className).toContain("overflow-y-auto");
    const image = dialog.querySelector("img") as HTMLImageElement;
    expect(image.className).toContain("max-h-[50vh]");
  });
});
