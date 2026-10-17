// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { ParallaxLayer, PARALLAX_RANGE_PX } from "./ParallaxLayer";

/**
 * Hero parallax layers (portfolio-motion T7): tiny transform-only offsets that
 * separate hero layers at slightly different speeds while scrolling the first
 * viewport. Caps: |offset| never exceeds the layer's maxPx (≤10px by design),
 * and reduced motion disables the whole effect (globals.css neutralizes the
 * transform transitions; the effect also stops updating).
 */

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ParallaxLayer", () => {
  function setScroll(y: number) {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  }

  it("renders its children inside the layer and starts unshifted", () => {
    const { container, getByText } = render(
      <ParallaxLayer maxPx={10}>
        <p>capa</p>
      </ParallaxLayer>,
    );
    const layer = container.firstElementChild as HTMLElement;

    expect(getByText("capa")).toBeTruthy();
    expect(layer.getAttribute("data-parallax")).toBe("10");
    expect(layer.style.transform).toBe("translate3d(0, 0px, 0)");
  });

  it("shifts by maxPx across the scroll range and saturates", () => {
    const { container } = render(
      <ParallaxLayer maxPx={10}>
        <p>capa</p>
      </ParallaxLayer>,
    );
    const layer = container.firstElementChild as HTMLElement;

    setScroll(PARALLAX_RANGE_PX / 2);
    fireEvent.scroll(document);
    expect(layer.style.transform).toBe("translate3d(0, 5px, 0)");

    setScroll(PARALLAX_RANGE_PX * 4);
    fireEvent.scroll(document);
    expect(layer.style.transform).toBe("translate3d(0, 10px, 0)");
  });

  it("supports negative layers moving the opposite way", () => {
    const { container } = render(
      <ParallaxLayer maxPx={-4}>
        <p>capa</p>
      </ParallaxLayer>,
    );
    const layer = container.firstElementChild as HTMLElement;

    setScroll(PARALLAX_RANGE_PX / 2);
    fireEvent.scroll(document);
    expect(layer.style.transform).toBe("translate3d(0, -2px, 0)");
  });
});
