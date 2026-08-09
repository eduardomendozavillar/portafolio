import type { Project } from "../../types/project";

/**
 * Read-time validation and serialization for Firestore project records
 * (design: File Changes "parse.ts").
 *
 * Pure module: no Next.js or firebase runtime imports, so it can be unit
 * tested with plain objects. A Firestore `Timestamp` is duck-typed via its
 * `toDate()` method.
 */

/** Accepts a Date, a Firestore-like Timestamp (with toDate()), or an ISO string. */
export function toIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate(): Date }).toDate();
    if (date instanceof Date) {
      return date.toISOString();
    }
  }
  if (typeof value === "string") {
    return value;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

const STRING_FIELDS = ["title", "summary", "description"] as const;

/**
 * Validates a Firestore project record and serializes it to the client
 * `Project` shape. Returns null when the record is malformed so the caller
 * can omit it instead of failing the whole response (projects-content spec:
 * "Malformed records do not break the response").
 */
export function parseProjectRecord(id: string, data: unknown): Project | null {
  if (!isRecord(data)) {
    return null;
  }

  for (const field of STRING_FIELDS) {
    if (typeof data[field] !== "string") {
      return null;
    }
  }

  const createdAt = toIsoString(data.createdAt);
  const updatedAt = toIsoString(data.updatedAt);
  if (createdAt === null || updatedAt === null) {
    return null;
  }

  if (!Array.isArray(data.technologies) || data.technologies.some((t) => typeof t !== "string")) {
    return null;
  }

  if (typeof data.sortOrder !== "number") {
    return null;
  }

  const links = isRecord(data.links)
    ? {
        demo: typeof data.links.demo === "string" ? data.links.demo : undefined,
        repo: typeof data.links.repo === "string" ? data.links.repo : undefined,
      }
    : undefined;

  return {
    id,
    title: data.title as string,
    slug: typeof data.slug === "string" ? data.slug : undefined,
    summary: data.summary as string,
    description: data.description as string,
    technologies: data.technologies as string[],
    links,
    featured: data.featured === true,
    sortOrder: data.sortOrder as number,
    createdAt,
    updatedAt,
  };
}

/**
 * Maps Firestore snapshot-like items ({ id, data }) to an ordered Project[]
 * array, omitting any malformed record. `data` may be a plain object or a
 * function returning it (matching QueryDocumentSnapshot's data()).
 */
export function parseProjects(
  docs: ReadonlyArray<{ id: string; data: unknown }>,
): Project[] {
  const projects: Project[] = [];
  for (const doc of docs) {
    const record = typeof doc.data === "function" ? doc.data() : doc.data;
    const project = parseProjectRecord(doc.id, record);
    if (project !== null) {
      projects.push(project);
    }
  }
  return projects;
}