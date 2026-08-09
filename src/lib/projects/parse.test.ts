import { describe, expect, it } from "vitest";
import { parseProjectRecord, parseProjects, toIsoString } from "./parse";

/** Firestore-like Timestamp duck type. */
function timestamp(iso: string): { toDate(): Date } {
  return { toDate: () => new Date(iso) };
}

const validRecord = {
  title: "Proyecto Alpha",
  slug: "alpha",
  summary: "Resumen corto.",
  description: "Descripción larga.\n\nSegundo párrafo.",
  technologies: ["Next.js", "TypeScript"],
  links: { demo: "https://demo.example.com", repo: "https://github.com/x/y" },
  featured: true,
  sortOrder: 2,
  createdAt: timestamp("2026-01-02T10:00:00.000Z"),
  updatedAt: timestamp("2026-01-03T11:30:00.000Z"),
};

describe("toIsoString", () => {
  it("converts a Firestore-like Timestamp to ISO-8601", () => {
    expect(toIsoString(timestamp("2026-01-02T10:00:00.000Z"))).toBe(
      "2026-01-02T10:00:00.000Z",
    );
  });

  it("converts a Date instance", () => {
    expect(toIsoString(new Date("2026-01-02T10:00:00.000Z"))).toBe(
      "2026-01-02T10:00:00.000Z",
    );
  });

  it("passes ISO strings through", () => {
    expect(toIsoString("2026-01-02T10:00:00.000Z")).toBe("2026-01-02T10:00:00.000Z");
  });

  it("returns null for non-timestamp values", () => {
    expect(toIsoString(42)).toBeNull();
    expect(toIsoString(null)).toBeNull();
    expect(toIsoString(undefined)).toBeNull();
  });
});

describe("parseProjectRecord", () => {
  it("parses a valid record and serializes timestamps to ISO", () => {
    const project = parseProjectRecord("doc-1", validRecord);
    expect(project).not.toBeNull();
    expect(project?.id).toBe("doc-1");
    expect(project?.title).toBe("Proyecto Alpha");
    expect(project?.sortOrder).toBe(2);
    expect(project?.featured).toBe(true);
    expect(project?.createdAt).toBe("2026-01-02T10:00:00.000Z");
    expect(project?.updatedAt).toBe("2026-01-03T11:30:00.000Z");
    expect(project?.links?.demo).toBe("https://demo.example.com");
  });

  it("defaults featured to false and links to undefined when absent", () => {
    const project = parseProjectRecord("doc-2", {
      ...validRecord,
      featured: undefined,
      links: undefined,
    });
    expect(project?.featured).toBe(false);
    expect(project?.links).toBeUndefined();
  });

  it("returns null for a non-object record", () => {
    expect(parseProjectRecord("doc-3", "hola")).toBeNull();
    expect(parseProjectRecord("doc-3", null)).toBeNull();
  });

  it("returns null when a required string field is missing", () => {
    const project = parseProjectRecord("doc-4", { ...validRecord, title: undefined });
    expect(project).toBeNull();
  });

  it("returns null when sortOrder is not a number", () => {
    expect(parseProjectRecord("doc-5", { ...validRecord, sortOrder: "2" })).toBeNull();
  });

  it("returns null when technologies is not a string array", () => {
    expect(
      parseProjectRecord("doc-6", { ...validRecord, technologies: ["ok", 42] }),
    ).toBeNull();
  });

  it("returns null when a timestamp is missing", () => {
    const project = parseProjectRecord("doc-7", { ...validRecord, createdAt: undefined });
    expect(project).toBeNull();
  });
});

describe("parseProjects", () => {
  it("omits malformed records and keeps valid ones", () => {
    const docs = [
      { id: "a", data: validRecord },
      { id: "b", data: { ...validRecord, title: 42 } },
      { id: "c", data: { ...validRecord, id2: "x" } },
    ];
    const projects = parseProjects(docs);
    expect(projects.map((p) => p.id)).toEqual(["a", "c"]);
  });

  it("accepts snapshot-like docs whose data is a function", () => {
    const docs = [{ id: "a", data: () => validRecord }];
    const projects = parseProjects(docs);
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe("a");
  });

  it("returns an empty array when there are no docs", () => {
    expect(parseProjects([])).toEqual([]);
  });

  it("offsets sortOrder into returned order (ascending input preserved)", () => {
    const docs = [
      { id: "low", data: { ...validRecord, sortOrder: 1 } },
      { id: "high", data: { ...validRecord, sortOrder: 2 } },
    ];
    const projects = parseProjects(docs);
    expect(projects.map((p) => p.sortOrder)).toEqual([1, 2]);
  });
});