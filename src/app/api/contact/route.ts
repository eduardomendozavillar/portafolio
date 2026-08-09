import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminFirestore } from "../../../lib/firebase/admin";
import { isHoneypotFilled } from "../../../lib/honeypot";
import { createRateLimiter, getClientIp } from "../../../lib/rate-limit";
import { contactSchema } from "../../../lib/validation/contact";

/**
 * POST /api/contact — validate → honeypot → rate limit → Firestore write.
 * Flow per design.md "Contact POST Flow":
 *   honeypot? ──▶ rateLimit? ──▶ zod? ──▶ contacts.add({status:"new", source:"portfolio"})
 *
 * Responses: 201 {ok,id} | 400 {ok:false,error} | 429 {ok:false,error}+Retry-After
 * | 500 {ok:false,error}. Honeypot hits return 200 {ok:true} with no write.
 */
const rateLimiter = createRateLimiter();

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "La solicitud no es un JSON válido." },
        { status: 400 },
      );
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, error: "La solicitud debe ser un objeto JSON." },
        { status: 400 },
      );
    }

    const record = body as Record<string, unknown>;

    // Honeypot: silently succeed, never persist, never educate bots.
    if (isHoneypotFilled(record)) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Rate limit per client (first x-forwarded-for entry).
    const key = getClientIp(request);
    const verdict = rateLimiter.check(key);
    if (!verdict.allowed) {
      return NextResponse.json(
        { ok: false, error: "Demasiadas solicitudes. Inténtalo de nuevo en unos segundos." },
        { status: 429, headers: { "Retry-After": String(verdict.retryAfterSeconds) } },
      );
    }

    // Zod validation (design D2); reject without persisting.
    const parsed = contactSchema.safeParse(record);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstIssue?.message ?? "Los datos enviados no son válidos." },
        { status: 400 },
      );
    }

    const docRef = await getAdminFirestore().collection("contacts").add({
      ...parsed.data,
      status: "new",
      source: "portfolio",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor. Inténtalo de nuevo más tarde." },
      { status: 500 },
    );
  }
}