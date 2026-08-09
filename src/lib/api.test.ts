import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProjects, submitContact } from "./api";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("fetchProjects", () => {
  it("fetches /api/projects with no-store and returns the project list", async () => {
    const projects = [
      {
        id: "a",
        title: "Alpha",
        summary: "S.",
        description: "D",
        technologies: ["Next.js"],
        featured: false,
        sortOrder: 1,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => projects,
    }) as unknown as typeof fetch;

    await expect(fetchProjects()).resolves.toEqual(projects);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/projects", { cache: "no-store" });
  });

  it("throws when the response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ ok: false }),
    }) as unknown as typeof fetch;

    await expect(fetchProjects()).rejects.toThrow();
  });
});

describe("submitContact", () => {
  it("POSTs the message as JSON and returns the ApiResponse", async () => {
    const message = { name: "Ana", email: "ana@example.com", message: "Hola." };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ ok: true, id: "abc123" }),
    }) as unknown as typeof fetch;

    await expect(submitContact(message)).resolves.toEqual({ ok: true, id: "abc123" });

    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0]!;
    expect(url).toBe("/api/contact");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual(message);
  });

  it("throws on a 500 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ ok: false, error: "x" }),
    }) as unknown as typeof fetch;

    await expect(
      submitContact({ name: "Ana", email: "ana@example.com", message: "Hola." }),
    ).rejects.toThrow();
  });

  it("returns the error envelope for 400/429 without throwing", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, error: "El nombre es obligatorio." }),
    }) as unknown as typeof fetch;

    await expect(
      submitContact({ name: "", email: "ana@example.com", message: "Hola." }),
    ).resolves.toEqual({ ok: false, error: "El nombre es obligatorio." });
  });
});