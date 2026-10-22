// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { IntroSplash, INTRO_SEEN_KEY } from "./IntroSplash";

/**
 * Blocking intro splash (portfolio-recruiter S2, mirroring the load moment
 * the user liked): avatar + name + stack + progress bar, ~1.2s total, shown
 * only on the first visit of a session (sessionStorage), skippable with
 * click/Esc, hidden outright for no-JS (noscript style) and under
 * prefers-reduced-motion (globals.css rule). Decorative (aria-hidden): the
 * real SSR content stays in the document behind it.
 */

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.style.overflow = "";
});

/** Fake timers must also own rAF: dismissal defers the final setState to a
 * frame (react-hooks sync-setState rule), so tests advance it explicitly. */
function useIntroTimers() {
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "Date",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ],
  });
}

describe("IntroSplash", () => {
  it("renders the SSR overlay with avatar, name and noscript guard", () => {
    const { container } = render(<IntroSplash />);
    const splash = container.querySelector("[data-intro-splash]") as HTMLElement;

    expect(splash).toBeTruthy();
    expect(splash.getAttribute("aria-hidden")).toBe("true");
    expect(splash.querySelector("img")).toBeTruthy();
    expect(splash.textContent).toContain("Eduardo Mendoza Villar");
    expect(splash.querySelector("noscript")).toBeTruthy();
  });

  it("dismisses itself after the hold window and marks the session as seen", () => {
    useIntroTimers();
    const { container } = render(<IntroSplash />);

    act(() => vi.advanceTimersByTime(1_000)); // within the hold → still visible
    expect(container.querySelector("[data-intro-splash]")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(400); // fade window elapsed
      vi.advanceTimersByTime(100); // defer timers → unmounted
    });
    expect(container.querySelector("[data-intro-splash]")).toBeNull();
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe("1");
  });

  it("click and Escape skip it immediately", () => {
    useIntroTimers();
    const { container } = render(<IntroSplash />);

    fireEvent.pointerDown(container.querySelector("[data-intro-splash]") as HTMLElement);
    act(() => vi.advanceTimersByTime(400));
    expect(container.querySelector("[data-intro-splash]")).toBeNull();

    render(<IntroSplash />);
    expect(document.querySelector("[data-intro-splash]")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    act(() => vi.advanceTimersByTime(400));
    expect(document.querySelector("[data-intro-splash]")).toBeNull();
  });

  it("never shows again inside the same session", () => {
    useIntroTimers();
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    const { container } = render(<IntroSplash />);

    act(() => vi.advanceTimersByTime(2_000));
    expect(container.querySelector("[data-intro-splash]")).toBeNull();
  });

  it("locks body scroll while visible and restores it on dismiss", () => {
    useIntroTimers();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "";

    render(<IntroSplash />);
    expect(document.body.style.overflow).toBe("hidden");

    act(() => vi.advanceTimersByTime(1_600));
    expect(document.body.style.overflow).toBe(previous);
    document.body.style.overflow = previous;
  });
});
