// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Header } from "@/app/sections/Header";
import { LanguageProvider } from "./LanguageProvider";

/**
 * S11 (full-site ES/EN toggle): the header language pill is a real button
 * that swaps the dictionary (nav labels, hire-me CTA), persists the choice
 * in localStorage ("ev-lang") and keeps <html lang> in sync. Default is ES
 * (the CV's language), so every existing Spanish assertion keeps passing.
 */
function renderHeader() {
  return render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>,
  );
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("LanguageProvider (S11 ES/EN toggle)", () => {
  it("defaults to Spanish: nav reads Inicio/Sobre mí and the pill is ES", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Inicio" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sobre mí" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cambiar idioma a inglés" }).textContent).toBe("ES");
    expect(document.documentElement.lang).toBe("es");
  });

  it("switches to English on click: labels swap and <html lang> follows", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Cambiar idioma a inglés" }));
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "About me" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Hire me" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Switch language to Spanish" }).textContent).toBe("EN");
    expect(document.documentElement.lang).toBe("en");
  });

  it("persists the choice: a fresh provider restores EN from localStorage", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Cambiar idioma a inglés" }));
    cleanup();
    renderHeader();
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(window.localStorage.getItem("ev-lang")).toBe("en");
  });
});
