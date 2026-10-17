// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { TimelineDraw } from "./TimelineDraw";

/**
 * Timeline draw-in (portfolio-motion T6): a vertical accent line next to the
 * Experiencia list whose length tracks scroll progress while the section is
 * in view. Decorative (aria-hidden), repaint-only updates, and neutralized
 * under prefers-reduced-motion (globals.css).
 *
 * jsdom getBoundingClientRect zeroes are stubbed per test on Element.prototype.
 */

function stubRects(mapRect: (el: Element) => DOMRect) {
  return vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      return mapRect(this);
    });
}

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

function setViewport(height: number) {
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
}

const items = (
  <ol>
    <li>Rol uno</li>
    <li>Rol dos</li>
  </ol>
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TimelineDraw", () => {
  it("starts undrawn and renders its children inside the track", () => {
    setViewport(1000);
    stubRects(() => rect(1100, 1000)); // track entirely below the start line
    const { container, getByText } = render(<TimelineDraw>{items}</TimelineDraw>);
    const track = container.firstElementChild as HTMLElement;
    const fill = track.querySelector("[data-timeline-draw]") as HTMLElement;

    expect(getByText("Rol uno")).toBeTruthy();
    expect(fill.getAttribute("data-progress")).toBe("0");
  });

  it("draws proportionally as the track scrolls into view", () => {
    setViewport(1000);
    let scrollOffset = 0;
    // Dispatch synthetic scroll events; getBoundingClientRect must respond to
    // the simulated scroll state, so the track top moves with scrollY.
    window.scrollY;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollOffset,
      configurable: true,
    });
    const spy = stubRects(() => rect(600 - scrollOffset, 1000));
    const { container } = render(<TimelineDraw>{items}</TimelineDraw>);
    const fill = container.querySelector("[data-timeline-draw]") as HTMLElement;

    scrollOffset = 100; // track top -> 500 of a 1000px viewport
    fireEvent.scroll(document);

    expect(spy).toHaveBeenCalled();
    // Start at 0.75*vh = 750 from top: (750 - 500) / 1000 = 0.25.
    expect(fill.getAttribute("data-progress")).toBe("25");
  });

  it("saturates at 100% once fully drawn", () => {
    setViewport(1000);
    let scrollOffset = 0;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollOffset,
      configurable: true,
    });
    stubRects(() => rect(600 - scrollOffset, 1000));
    const { container } = render(<TimelineDraw>{items}</TimelineDraw>);
    const fill = container.querySelector("[data-timeline-draw]") as HTMLElement;

    scrollOffset = 1600; // track top -> -1000, well past the start line
    fireEvent.scroll(document);

    expect(fill.getAttribute("data-progress")).toBe("100");
  });
});
