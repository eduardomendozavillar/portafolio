// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { contributionDays, contributionsActiveDays } from "@/data/contributions";

/**
 * Activity wheel (S15 "plus del plus"): the contribution year as a radial
 * clock — 53 sectors × 7 rings, barber intensity levels, tap/hover detail
 * in an aria-live chip, center shows the active-day figure and the best
 * streak. Square SVG: desktop and mobile read the same graphic (no
 * horizontal scroll, nothing lost on narrow screens). Reads the generated
 * static module — assertions are structural, never on snapshot numbers.
 */
describe("ActivityHeatmap wheel", () => {
  it("draws one sector per recorded day plus lead padding", () => {
    const { container } = render(<ActivityHeatmap />);

    const cells = container.querySelectorAll("[class*='wheel-level-']");
    expect(cells.length).toBeGreaterThanOrEqual(contributionDays.length);
  });

  it("shows the real active-day figure and the view-profile link", () => {
    render(<ActivityHeatmap />);

    expect(
      screen.getByText(String(contributionsActiveDays)),
    ).toBeTruthy();
    // The legend line and the wheel center both read the figure — fine (one
    // is the summary sentence, the other the wheel's centerpiece).
    expect(screen.getAllByText(/días con actividad/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Ver perfil en GitHub")).toBeTruthy();
  });

  it("colors the wheel with every intensity level present in the data", () => {
    const { container } = render(<ActivityHeatmap />);

    for (const level of [0, 1, 2, 3]) {
      expect(
        container.querySelectorAll(`.wheel-level-${level}`).length,
      ).toBeGreaterThan(0);
    }
  });

  it("reveals the tapped day in the aria-live chip (mobile = tap)", () => {
    const { container } = render(<ActivityHeatmap />);

    const chip = container.querySelector("[aria-live='polite']") as HTMLElement;
    expect(chip.textContent).toContain("Tocá un sector");

    const hot = container.querySelector(".wheel-level-3") as SVGPathElement;
    fireEvent.click(hot);
    expect(chip.textContent).toMatch(/contribuciones el/i);
  });

  it("labels the twelve months around the wheel", () => {
    const { container } = render(<ActivityHeatmap />);

    const labels = container.querySelectorAll("svg text");
    expect(labels.length).toBe(12);
  });

  it("shows the best streak in the center", () => {
    render(<ActivityHeatmap />);

    expect(screen.getByText(/racha máx/i)).toBeTruthy();
  });
});
