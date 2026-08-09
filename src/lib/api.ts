import { HONEYPOT_FIELD } from "./honeypot";
import type { ApiResponse } from "../types/api";
import type { ContactMessage } from "../types/contact";
import type { Project } from "../types/project";

/**
 * Typed client helpers for the API routes (design: File Changes "api.ts").
 * Used by client components in Phase 3. `cache: "no-store"` is the client
 * default in Next 15+ and is set explicitly so every fetch sees fresh data
 * (projects-content spec: changes reflected without redeploy).
 */

/** GET /api/projects — ordered, ISO-serialized project list. */
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`GET /api/projects failed with status ${response.status}`);
  }
  return (await response.json()) as Project[];
}

/**
 * POST /api/contact — returns the ApiResponse envelope (incl. 429/400).
 * The optional honeypot field is transmitted so the server can drop bots;
 * it is stripped by the zod schema and never persisted.
 */
export async function submitContact(
  message: ContactMessage & { [HONEYPOT_FIELD]?: string },
): Promise<ApiResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
    cache: "no-store",
  });
  if (!response.ok && response.status === 500) {
    throw new Error(`POST /api/contact failed with status ${response.status}`);
  }
  return (await response.json()) as ApiResponse;
}