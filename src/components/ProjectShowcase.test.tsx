// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectShowcase } from "./ProjectShowcase";
import type { Project } from "@/types/project";

/**
 * Sticky showcase panel (portfolio-motion showcase-sticky, desktop): while the
 * recruiter scrolls the project list, a sticky panel shows the active
 * project's screenshot — the card whose center is nearest the viewport center
 * — swapping with a quick fade/slide (skipped entirely under reduced motion).
 * The panel's "Vista previa" button opens the existing lightbox.
 *
 * Active tracking uses a scroll listener + getBoundingClientRect of the list
 * items (data-project-card="N"), so tests stub rects per element on
 * Element.prototype (house pattern from TimelineDraw tests).
 */

function project(overrides: Partial<Project>): Project {
  return {
    id: "p",
    title: "Uno",
    summary: "Resumen corto.",
    description: "Descripción larga.",
    technologies: ["React"],
    featured: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    images: [
      { src: "/images/projects/uno/uno-01.webp", width: 800, height: 500 },
      { src: "/images/projects/uno/uno-02.webp", width: 800, height: 500 },
    ],
    ...overrides,
  };
}

function imagesFor(slug: string) {
  return [
    { src: `/images/projects/${slug}/${slug}-01.webp`, width: 800, height: 500 },
    { src: `/images/projects/${slug}/${slug}-02.webp`, width: 800, height: 500 },
  ];
}

const projects = [
  project({ id: "a", title: "Alpha", slug: "alpha", images: imagesFor("alpha") }),
  project({ id: "b", title: "Beta", slug: "beta", images: imagesFor("beta") }),
  project({ id: "c", title: "Gamma", slug: "gamma", images: imagesFor("gamma") }),
];

function rect(top: number, height: number): DOMRect {
  return {
    top,
    height,
    width: 800,
    left: 0,
    right: 800,
    bottom: top + height,
    x: 0,
    y: top,
    toJSON: () => undefined,
  } as unknown as DOMRect;
}

afterEach(() => {
  vi.restoreAllMocks();
});

function stubCardRects(tops: number[], cardHeight = 300) {
  return vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const index = Number(this.getAttribute("data-project-card") ?? -1);
      if (index >= 0) return rect(tops[index] ?? 0, cardHeight);
      return rect(0, 100);
    });
}

describe("ProjectShowcase", () => {
  it("starts showing the first project's cover", () => {
    stubCardRects([300, 900, 1200]); // card 0 top crossed the 35% trigger line
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { container } = render(
      <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />,
    );

    const img = container.querySelector("img") as HTMLImageElement;
    expect((img.getAttribute("src") ?? "").includes("alpha-01")).toBe(true);
    expect(container.querySelector('[data-active-project="0"]')).toBeTruthy();
  });

  it("switches the panel to the card nearest the viewport center on scroll", () => {
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    let offset = 0;
    Object.defineProperty(window, "scrollY", { get: () => offset, configurable: true });
    // Chunk tops: card centers at top+150. The scroll listener reads rects
    // live, so the stub must respond to the simulated scroll with -offset.
    const tops = [600, 900, 1200];
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const index = Number(this.getAttribute("data-project-card") ?? -1);
        if (index >= 0) return rect(tops[index] - offset, 300);
        return rect(0, 100);
      },
    );
    const { container } = render(
      <>
        <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />
        {/* The showcase reads the list cards from the document, so this
            isolated render needs minimal nodes mirroring ProjectList hooks. */}
        <ol>
          {projects.map((item, index) => (
            <li key={item.id} data-project-card={index} data-project-id={item.id}>
              {item.title}
            </li>
          ))}
        </ol>
      </>,
    );

    // After scrolling 600px, card tops become 0/300/600: centers 150/450/750 —
    // viewport center 500 → nearest is Beta (450).
    offset = 600;
    fireEvent.scroll(document);

    expect(
      container.querySelector('[data-active-project="1"]'),
    ).toBeTruthy();
    const img = container.querySelector("img") as HTMLImageElement;
    expect((img.getAttribute("src") ?? "").includes("beta-01")).toBe(true);
  });

  it("panels are swapped with an animated layer and offer a Vista previa control", () => {
    stubCardRects([600, 900, 1200]);
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    const onOpenPreview = vi.fn();
    const { container } = render(
      <ProjectShowcase projects={projects} onOpenPreview={onOpenPreview} />,
    );

    // Keyed remount layer animates in (globals.css preview-in) unless reduced.
    expect(container.querySelector('[data-showcase-layer]')).toBeTruthy();

    const button = screen.getByRole("button", { name: "Ampliar vista previa de Alpha" });
    expect(button.textContent).toContain("Vista previa");
    fireEvent.click(button);
    // Contract: (project clicked for, event) so the opener can return focus.
    expect(onOpenPreview as unknown as (project: Project, event: unknown) => void).toHaveBeenCalledWith(
      projects[0],
      expect.anything(),
    );
  });

  it("retracts only when the list is entirely below the viewport", () => {
    // The whole list below the viewport (user still at the hero): no image
    // travelled yet, so the panel retracts (no stale cover, no controls).
    stubCardRects([1500, 1800, 2100]);
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { container } = render(
      <>
        <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />
        <ol>
          {projects.map((item, index) => (
            <li key={item.id} data-project-card={index} data-project-id={item.id}>
              {item.title}
            </li>
          ))}
        </ol>
      </>,
    );

    expect(container.querySelector('[data-active-project="-1"]')).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[data-showcase-retracted]")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("holds the first project's cover while entering the list with nothing crossed yet", () => {
    // List partially in view (user just reached the section) but no card has
    // crossed the 35% reading line: the first project holds in the panel —
    // never an empty frame mid-list (user rule: while the list is visible,
    // the image remains).
    stubCardRects([600, 900, 1200]);
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    const { container } = render(
      <>
        <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />
        <ol>
          {projects.map((item, index) => (
            <li key={item.id} data-project-card={index} data-project-id={item.id}>
              {item.title}
            </li>
          ))}
        </ol>
      </>,
    );

    expect(container.querySelector('[data-active-project="0"]')).toBeTruthy();
    const img = container.querySelector("img") as HTMLImageElement;
    expect((img.getAttribute("src") ?? "").includes("alpha-01")).toBe(true);
  });

  it("walks back through projects when scrolling in reverse", () => {
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    let offset = 0;
    Object.defineProperty(window, "scrollY", { get: () => offset, configurable: true });
    const tops = [600, 900, 1200];
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const index = Number(this.getAttribute("data-project-card") ?? -1);
        if (index >= 0) return rect(tops[index] - offset, 300);
        return rect(0, 100);
      },
    );
    const { container } = render(
      <>
        <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />
        <ol>
          {projects.map((item, index) => (
            <li key={item.id} data-project-card={index} data-project-id={item.id}>
              {item.title}
            </li>
          ))}
        </ol>
      </>,
    );

    offset = 600; // tops 0 / 300 / 600 → Beta is the last above the line
    fireEvent.scroll(document);
    expect(container.querySelector('[data-active-project="1"]')).toBeTruthy();

    offset = 300; // reverse: tops 300 / 600 / 900 → only Alpha crossed again
    fireEvent.scroll(document);
    expect(container.querySelector('[data-active-project="0"]')).toBeTruthy();
    const img = container.querySelector("img") as HTMLImageElement;
    expect((img.getAttribute("src") ?? "").includes("alpha-01")).toBe(true);
  });

  it("keeps the last project once the list is fully scrolled past", () => {
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    let offset = 0;
    Object.defineProperty(window, "scrollY", { get: () => offset, configurable: true });
    const tops = [600, 900, 1200];
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const index = Number(this.getAttribute("data-project-card") ?? -1);
        if (index >= 0) return rect(tops[index] - offset, 300);
        return rect(0, 100);
      },
    );
    const { container } = render(
      <>
        <ProjectShowcase projects={projects} onOpenPreview={() => undefined} />
        <ol>
          {projects.map((item, index) => (
            <li key={item.id} data-project-card={index} data-project-id={item.id}>
              {item.title}
            </li>
          ))}
        </ol>
      </>,
    );

    offset = 2000; // every top far above the line → last project holds
    fireEvent.scroll(document);
    expect(container.querySelector('[data-active-project="2"]')).toBeTruthy();
    const img = container.querySelector("img") as HTMLImageElement;
    expect((img.getAttribute("src") ?? "").includes("gamma-01")).toBe(true);
  });
});
