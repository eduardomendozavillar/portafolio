// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ScrollProgress } from "./ScrollProgress";

/**
 * Section-scroll progress indicator (portfolio-motion T5): a 2px accent bar
 * under the sticky header whose width tracks reading progress. Updates are
 * repaint-only (width via style), announced to nobody (aria-hidden).
 */

describe("ScrollProgress", () => {
  function setupDocument(totalHeight: number, viewportHeight: number) {
    Object.defineProperty(window, "innerHeight", { value: viewportHeight, configurable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: totalHeight,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: viewportHeight,
      configurable: true,
    });
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  }

  it("starts at zero width before any scroll", () => {
    setupDocument(2000, 1000);
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(bar.getAttribute("data-progress")).toBe("0");
  });

  it("tracks scroll progress as width percentage", () => {
    setupDocument(2000, 1000);
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;

    Object.defineProperty(window, "scrollY", { value: 250, configurable: true });
    fireEvent.scroll(document);

    expect(bar.getAttribute("data-progress")).toBe("25");
  });

  it("saturates at 100% near the bottom even with rounding", () => {
    setupDocument(2000, 1000);
    Object.defineProperty(window, "scrollY", { value: 1000, configurable: true });
    const { container } = render(<ScrollProgress />);
    const bar = container.firstElementChild as HTMLElement;

    fireEvent.scroll(document);

    expect(bar.getAttribute("data-progress")).toBe("100");
  });
});
