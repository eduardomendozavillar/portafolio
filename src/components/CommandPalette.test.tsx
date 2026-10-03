// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Header } from "@/app/sections/Header";
import { CommandPalette } from "./CommandPalette";

/**
 * RTL suite for the command palette (WU-A): Ctrl+K / ⌘K + header trigger,
 * Esc + backdrop close with focus restoration, filter + Spanish no-results,
 * ↑/↓ + Enter section jump (scrollIntoView mocked) and clipboard copy.
 * The header is rendered because it owns the palette open state and trigger.
 */

const originalScrollIntoView = Element.prototype.scrollIntoView;

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView;
  document.body
    .querySelectorAll("[data-palette-test-target]")
    .forEach((node) => node.remove());
  vi.restoreAllMocks();
});

function installScrollIntoViewMock() {
  const scrollSpy = vi.fn();
  Element.prototype.scrollIntoView = scrollSpy;
  return scrollSpy;
}

function installClipboardMock() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

function addSectionTarget(id: string) {
  const target = document.createElement("div");
  target.id = id;
  target.setAttribute("data-palette-test-target", "");
  document.body.appendChild(target);
  return target;
}

const TRIGGER_LABEL = "Abrir navegación rápida (Ctrl+K)";

describe("CommandPalette", () => {
  it("opens with Ctrl+K and ⌘K, focuses the search input, and closes with Esc returning focus to the trigger", () => {
    render(<Header />);

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByText("Navegación rápida"),
    ).toBeTruthy();
    expect(within(dialog).getByLabelText("Buscar sección o proyecto")).toBe(
      document.activeElement,
    );
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(screen.getByRole("button", { name: TRIGGER_LABEL })).toBe(
      document.activeElement,
    );

    // ⌘K (metaKey) also opens.
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("opens via the header trigger button and closes on backdrop click", () => {
    render(<Header />);

    fireEvent.click(screen.getByRole("button", { name: TRIGGER_LABEL }));
    expect(
      screen
        .getByRole("button", { name: TRIGGER_LABEL })
        .getAttribute("aria-haspopup"),
    ).toBe("dialog");
    const overlay = screen.getByRole("dialog").parentElement as HTMLElement;

    // Clicks inside the dialog do not close it.
    fireEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Proyectos",
      }),
    );
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(overlay);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("narrows results while typing and shows the Spanish no-results state", () => {
    render(<Header />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const input = screen.getByLabelText(
      "Buscar sección o proyecto",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "sgdi" } });
    expect(
      screen.getByText("SGDI — Ventanilla Única de Radicación"),
    ).toBeTruthy();
    expect(screen.queryByText("FitBox Elite")).toBeNull();

    fireEvent.change(input, { target: { value: "xyzsinresultados" } });
    expect(screen.getByRole("status").textContent).toContain(
      "Sin resultados para «xyzsinresultados»",
    );
  });

  it("moves the active option with ↓ and executes a section jump with Enter", () => {
    const scrollSpy = installScrollIntoViewMock();
    const target = addSectionTarget("sobre-mi");
    render(<Header />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const input = screen.getByLabelText(
      "Buscar sección o proyecto",
    ) as HTMLInputElement;

    fireEvent.keyDown(input, { key: "ArrowDown" });
    // ↓ lands on the next option ("Proyectos"), ↑ returns to "Sobre mí".
    expect(document.activeElement?.textContent).toContain("Proyectos");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(scrollSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy.mock.instances[0]).toBe(target);
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("executes 'Copiar email' with Enter, writes to the clipboard and shows 'Copiado ✓'", async () => {
    const writeText = installClipboardMock();
    render(<Header />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const input = screen.getByLabelText(
      "Buscar sección o proyecto",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "copiar" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(writeText).toHaveBeenCalledWith("eduardomendozavillar@gmail.com");
    expect(await screen.findByText("Copiado ✓")).toBeTruthy();
  });

  it("executes an action on click and keeps focus inside the dialog on Tab", () => {
    const scrollSpy = installScrollIntoViewMock();
    const target = addSectionTarget("contacto");
    render(<Header />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const dialog = screen.getByRole("dialog");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Contacto" }),
    );
    expect(scrollSpy.mock.instances[0]).toBe(target);

    // Focus trap: Tab from the last option wraps back inside the dialog.
    const options = within(dialog).getAllByRole("button");
    const last = options[options.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("renders without the trigger when used standalone (controlled API)", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <CommandPalette
        open={false}
        onOpen={() => {}}
        onClose={onClose}
        triggerRef={{ current: null }}
      />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(
      <CommandPalette
        open
        onOpen={() => {}}
        onClose={onClose}
        triggerRef={{ current: null }}
      />,
    );
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
