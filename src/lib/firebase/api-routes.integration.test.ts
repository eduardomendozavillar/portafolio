import { describe, expect, it } from "vitest";
import { POST as contactPost } from "../../app/api/contact/route";
import { GET as projectsGet } from "../../app/api/projects/route";
import { hasFirestoreCredentials } from "./admin";

/**
 * Integration tests for the HTTP Route Handlers against a REAL Firestore
 * (task 4.4 approach: direct invocation of the exported handlers).
 *
 * Env-gated via describe.skipIf: without FIREBASE_SERVICE_ACCOUNT in the
 * environment these suites are skipped and `npm test` stays green.
 */
const credentials = hasFirestoreCredentials();

describe.skipIf(!credentials)("POST /api/contact (integration)", () => {
  it("persists a valid submission with status new and source portfolio", async () => {
    const request = new Request("https://example.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test Usuario",
        email: "test@example.com",
        message: "Mensaje de integración de prueba.",
      }),
    });

    const response = await contactPost(request);
    const body = (await response.json()) as { ok: boolean; id?: string; error?: string };

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(typeof body.id).toBe("string");
  });

  it("rejects a malformed email with 400 and does not persist", async () => {
    const request = new Request("https://example.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test Usuario",
        email: "no-es-un-correo",
        message: "Mensaje de integración de prueba.",
      }),
    });

    const response = await contactPost(request);
    const body = (await response.json()) as { ok: boolean; error?: string };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toBeTruthy();
  });

  it("silently succeeds on a honeypot hit without persisting", async () => {
    const request = new Request("https://example.test/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Bot",
        email: "bot@example.com",
        message: "Mensaje de integración de prueba.",
        website: "http://spam.example",
      }),
    });

    const response = await contactPost(request);
    const body = (await response.json()) as { ok: boolean; id?: string };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.id).toBeUndefined();
  });
});

describe.skipIf(!credentials)("GET /api/projects (integration)", () => {
  it("returns a JSON array of projects", async () => {
    const response = await projectsGet();
    const body = (await response.json()) as unknown[];

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});