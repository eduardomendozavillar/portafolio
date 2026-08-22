/**
 * Firestore-backed project record, serialized to the client as ISO-8601
 * strings. Mirrors the firestore.projects/{projectId} schema from design.md.
 * `status` is optional client-side maturity for featured / curated rows.
 */
export type ProjectStatus = "production" | "development" | "personal";

export type Project = {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  /** Plain text with blank-line separated paragraphs in v1. */
  description: string;
  technologies: string[];
  links?: {
    demo?: string;
    repo?: string;
  };
  /** Optional maturity badge for recruiter scan (API may omit). */
  status?: ProjectStatus;
  featured: boolean;
  sortOrder: number;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** ISO-8601 timestamp. */
  updatedAt: string;
};
