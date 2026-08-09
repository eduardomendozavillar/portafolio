import { NextResponse } from "next/server";
import { getAdminFirestore } from "../../../lib/firebase/admin";
import { parseProjects } from "../../../lib/projects/parse";

/**
 * GET /api/projects — dynamic, uncached.
 *
 * Design D1: no revalidate/force-dynamic export needed — Next 15+/16 GET
 * handlers are dynamic by default, so Firestore edits appear on reload
 * without a redeploy (projects-content spec).
 */
export async function GET(): Promise<Response> {
  try {
    const snapshot = await getAdminFirestore()
      .collection("projects")
      .orderBy("sortOrder", "asc")
      .get();

    const projects = parseProjects(snapshot.docs);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar los proyectos." },
      { status: 500 },
    );
  }
}