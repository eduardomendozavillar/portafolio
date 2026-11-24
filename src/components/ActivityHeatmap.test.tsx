// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { contributionDays, contributionsActiveDays } from "@/data/contributions";

/**
 * GitHub activity heatmap (portfolio-rebrand S7): reads the generated static
 * module (no runtime GitHub calls). The dataset refreshes via
 * `scripts/fetch-contributions.mjs`, so assertions are structural, never on
 * the snapshot numbers.
 */
describe("ActivityHeatmap", () => {
  it("scrolls horizontally on narrow screens instead of overflowing the card", () => {
    // Móvil (reporte post-deploy): 53 semanas × 15px ≈ 795px no caben en un
    // viewport de 360px — el grid debe vivir dentro de un contenedor
    // scrollable (sin scrollbar) y anclado a su propio ancho, nunca
    // desbordando la card hacia el resto de la página.
    const { container } = render(<ActivityHeatmap />);

    const scroller = container.querySelector(".heatmap-scroll") as HTMLElement;
    expect(scroller).toBeTruthy();
    expect(scroller.className).toContain("overflow-x-auto");
    expect(scroller.querySelector("[role='img']")).toBeTruthy();
  });

  it("renders one cell per contribution day plus first-week padding", () => {
    const { container } = render(<ActivityHeatmap />);

    const cells = container.querySelector("[role='img']")?.querySelectorAll("span");
    expect(cells?.length).toBeGreaterThanOrEqual(contributionDays.length);
  });

  it("shows the real active-days figure from the generated data", () => {
    const { container } = render(<ActivityHeatmap />);

    expect(container.textContent).toContain(
      `${contributionsActiveDays} días con actividad`,
    );
    expect(container.textContent).toContain("Ver perfil en GitHub");
  });

  it("levels the cells by contribution intensity", () => {
    const { container } = render(<ActivityHeatmap />);

    const levels = ["level-0", "level-1", "level-2", "level-3"];
    for (const level of levels) {
      expect(container.querySelectorAll(`.${level}`).length).toBeGreaterThan(0);
    }
  });
});
