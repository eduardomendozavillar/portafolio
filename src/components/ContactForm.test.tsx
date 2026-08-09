// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ContactForm } from "./ContactForm";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * RTL suite for ContactForm (task 4.3) — Spanish labels, keep-values-on-error,
 * honeypot transmission and the submitting state. The POST is mocked at the
 * fetch boundary (same pattern as src/lib/api.test.ts).
 */

const originalFetch = globalThis.fetch;

type FetchResponse = {
  ok: boolean;
  status: number;
  body: unknown;
};

function mockFetchResponse({ ok, status, body }: FetchResponse) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "ana@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mensaje"), {
    target: { value: "Hola, quería consultar por un proyecto." },
  });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders the Spanish form with all fields and a hidden honeypot", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText("Correo electrónico")).toBeTruthy();
    expect(screen.getByLabelText("Mensaje")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar mensaje" })).toBeTruthy();
    expect(
      screen.getByRole("form", { name: "Formulario de contacto" }),
    ).toBeTruthy();

    const honeypot = document.querySelector(
      `input[name="${HONEYPOT_FIELD}"]`,
    ) as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("shows the Spanish success message and clears the form on a 201", async () => {
    mockFetchResponse({ ok: true, status: 201, body: { ok: true, id: "abc123" } });
    render(<ContactForm />);

    fillForm();
    submit();

    const status = await screen.findByRole("status");
    expect(status.textContent).toContain("¡Gracias!");

    expect((screen.getByLabelText("Nombre") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Mensaje") as HTMLTextAreaElement).value).toBe("");

    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0]!;
    expect(url).toBe("/api/contact");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      name: "Ana",
      email: "ana@example.com",
      message: "Hola, quería consultar por un proyecto.",
      website: "",
    });
  });

  it("shows the server Spanish error and keeps values on a 400", async () => {
    mockFetchResponse({
      ok: false,
      status: 400,
      body: { ok: false, error: "Revisa los datos enviados." },
    });
    render(<ContactForm />);

    fillForm();
    submit();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Revisa los datos enviados.");

    expect((screen.getByLabelText("Nombre") as HTMLInputElement).value).toBe("Ana");
    expect(
      (screen.getByLabelText("Correo electrónico") as HTMLInputElement).value,
    ).toBe("ana@example.com");
    expect(
      (screen.getByLabelText("Mensaje") as HTMLTextAreaElement).value,
    ).toBe("Hola, quería consultar por un proyecto.");
  });

  it("shows the connection error Spanish message on a server failure (500)", async () => {
    mockFetchResponse({
      ok: false,
      status: 500,
      body: { ok: false, error: "Error interno" },
    });
    render(<ContactForm />);

    fillForm();
    submit();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Revisa tu conexión");

    // Values survive the failure so the visitor can retry.
    expect((screen.getByLabelText("Nombre") as HTMLInputElement).value).toBe("Ana");
  });

  it("transmits the honeypot value so the API can drop bot submissions", async () => {
    // Server honeypot path: silent 200 {ok:true}, no id — treated as success.
    mockFetchResponse({ ok: true, status: 200, body: { ok: true } });
    render(<ContactForm />);

    fillForm();
    const honeypot = document.querySelector(
      `input[name="${HONEYPOT_FIELD}"]`,
    ) as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "http://spam.example" } });
    submit();

    await screen.findByRole("status");

    const [, init] = vi.mocked(globalThis.fetch).mock.calls[0]!;
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(payload[HONEYPOT_FIELD]).toBe("http://spam.example");
    expect(payload.name).toBe("Ana");
  });

  it("disables the submit button while the request is in flight", async () => {
    let resolveFetch!: (response: unknown) => void;
    globalThis.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    ) as unknown as typeof fetch;

    render(<ContactForm />);
    fillForm();
    submit();

    const submittingButton = screen.getByRole("button", { name: "Enviando…" });
    expect((submittingButton as HTMLButtonElement).disabled).toBe(true);

    await act(async () => {
      resolveFetch({ ok: true, status: 201, json: async () => ({ ok: true, id: "x" }) });
    });

    expect(await screen.findByRole("status")).toBeTruthy();
  });
});