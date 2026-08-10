# Design: Portfolio — Next.js (App Router) + Firestore

## Technical Approach

Greenfield single-page portfolio (Spanish UI copy, English identifiers), Visual direction **B — Editorial light**. Static profile sections render from typed constants; `projects` and `contacts` live in Firestore and are reached exclusively through Route Handlers via a server-only Firebase Admin singleton. `GET /api/projects` is deliberately **dynamic (uncached)** so Firestore edits appear without redeploy; `POST /api/contact` is gated by Zod + honeypot + in-memory rate limit. Deny-all `firestore.rules`; credentials only via `FIREBASE_SERVICE_ACCOUNT`. Design maps 1:1 to the four delta specs (profile-presentation, projects-content, contact-form, deployment).

## Architecture Decisions

### D1 — Rendering strategy for Proyectos

| Option | Tradeoff | Decision |
|---|---|---|
| ISR `export const revalidate = 3600` | ≤1h stale results → violates "Firestore edit appears on reload" scenario | Rejected |
| Static at build | Fails freshness MUST outright | Rejected |
| Server Component reading Firestore directly | Freshest SSR, but duplicates the read path and bypasses the loading/empty/error client states the spec requires | Rejected for page consumption |
| **Dynamic GET handler + client `fetch(..., { cache: "no-store" })`** | ~1 Firestore read per page load; negligible at portfolio scale | **Chosen** |

The spec's freshness scenario (edit → reload → new title) MUST pass deterministically; any cache window breaks it. Loading, empty, and error states are inherently client-side, so the Proyectos section is a Client Component consuming `GET /api/projects` through the typed helper `src/lib/api.ts`. Next 15+/16 GET handlers are dynamic by default — no `revalidate`/`force-dynamic` exports needed; "no-store" is the client default, set explicitly for clarity.

### D2 — Contact validation & abuse controls

| Option | Tradeoff | Decision |
|---|---|---|
| Manual body checks | Drift-prone, untestable | Rejected |
| **Zod v4 single schema, trim + length caps** | Strict, typed, pure (unit-testable) | **Chosen** |
| Client-side validation only | No server-side write gate | Rejected |
| **In-memory per-instance Map limiter** | Resets on cold start, single-instance; acceptable on Vercel free tier | **Chosen** (Redis path documented, out of scope) |

### D3 — Credentials & security posture

| Option | Tradeoff | Decision |
|---|---|---|
| **Single `FIREBASE_SERVICE_ACCOUNT` JSON → `cert(JSON.parse(...))`** | One var; escaped `\n` accepted by Vercel | **Chosen** |
| Split `FIREBASE_PROJECT_ID`/`CLIENT_EMAIL`/`PRIVATE_KEY` | More vars, more drift | Documented alternative |
| Client Firebase SDK | Exposes credentials path; rules already deny | Rejected (no client SDK at all) |

### D4 — Firestore indexes

| Option | Tradeoff | Decision |
|---|---|---|
| Composite `featured+sortOrder` | Extra index provisioning | Rejected for v1 |
| **Single-field `orderBy("sortOrder")` / `orderBy("createdAt","desc")`** | Auto-indexed, zero config | **Chosen** |

## Firestore Schema

```
projects/{projectId}                  contacts/{autoId}
  title: string (req)                   name: string (req)
  slug: string (opt, future routes)     email: string (req)
  summary: string (req)                 message: string (req)
  description: string (req, plain       status: "new"|"read"|"archived" (default "new")
    text, \n\n paragraphs)              source: "portfolio"
  technologies: string[] (req)          createdAt: serverTimestamp
  links: { demo?: string, repo?: string }
  featured: boolean (default false)
  sortOrder: number (req)
  createdAt / updatedAt: serverTimestamp
```
Server timestamps only — trustworthy because Admin SDK writes them.

## Contact POST Flow

Zod: `name` trim 1–100; `email` trim, lowercase, well-formed, max 254; `message` trim 10–4000. Honeypot hidden field `website` (aria-hidden, tabIndex −1, visually hidden): if non-empty → silently return success **200** `{ok:true}` and write nothing (never educates bots). Rate limit: `WINDOW_MS = 60_000`, `MAX_REQUESTS = 3` per key (first `x-forwarded-for` entry, fallback "unknown"). Record written with `status: "new"`, `source: "portfolio"`, `createdAt: serverTimestamp`.

```
Browser [ContactForm] ──POST /api/contact──▶ honeypot? ──▶ rateLimit? ──▶ zod? ──▶ admin.firestore().collection("contacts").add()
     │   201 {ok,id} / 400 {ok:false,error} / 429 + Retry-After / 500 {ok:false,error}   (Spanish messages)
Browser [ProjectList] ──GET /api/projects──▶ orderBy("sortOrder") ──▶ parseProjectRecord (safeParse, malformed omitted) ──▶ 200 Project[]
```
Error messages in Spanish; contact form keeps values on failure so the visitor can retry.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/app/layout.tsx`, `page.tsx`, `globals.css` | Create | Root layout, single page composing sections, Tailwind v4 + editorial theme tokens |
| `src/app/sections/*.tsx` | Create | Header/nav (sticky + mobile menu), Hero, SobreMí, Habilidades, Proyectos(Client), Experiencia, Educación, Contacto(Client), Footer |
| `src/app/api/contact/route.ts`, `src/app/api/projects/route.ts` | Create | POST /api/contact, GET /api/projects |
| `src/components/ui/*.tsx`, `src/components/ContactForm.tsx`, `src/components/ProjectList.tsx`, `src/components/ProjectCard.tsx` | Create | Buttons/layout primitives, form + list (Spanish states) |
| `src/data/profile.ts`, `socials.ts`, `skills.ts`, `experience.ts`, `education.ts` | Create | Typed constants (editables with placeholder entries) |
| `src/types/*.ts` | Create | `Project`, `ContactMessage`, `ApiResponse` |
| `src/lib/firebase/admin.ts` | Create | `import "server-only"` guard; lazy singleton `cert(JSON.parse(env))` |
| `src/lib/validation/contact.ts`, `src/lib/honeypot.ts`, `src/lib/rate-limit.ts` | Create | Pure logic: zod schema, honeypot helper, injectable-clock limiter |
| `src/lib/projects/parse.ts`, `src/lib/api.ts` | Create | Read-time record validation + ISO conversion; typed client fetch |
| `scripts/seed-projects.mjs` | Create | Optional seed of 2 projects via Admin SDK |
| `firestore.rules` | Create | Deny-all (below) |
| `docs/setup.md` (es) | Create | Spanish Firebase + Vercel step-by-step guide |
| `vitest.config.ts`, `src/**/*.test.ts(x)` | Create | Test setup + suites |

Deny-all rules sketch: `rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } } }` — Admin SDK side-steps rules; Route Handlers are the only access path.

## Interfaces / Contracts

```ts
type Project = { id: string; title: string; slug?: string; summary: string;
  description: string; technologies: string[]; links?: { demo?: string; repo?: string };
  featured: boolean; sortOrder: number; createdAt: string; updatedAt: string } // ISO-8601

// GET /api/projects → 200 Project[] (dynamic, no-store)
// POST /api/contact → 201 {ok:true,id} | 400 {ok:false,error} | 429 {ok:false,error}+Retry-After | 500 {ok:false,error}
// honeypot hit → 200 {ok:true} (no write)
```

## Testing Strategy (Vitest ^4)

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Zod contact schema: valid/trim/length/email cases | Pure — no Firebase |
| Unit | `rate-limit.ts` (injectable clock/store): window, burst→429, per-key isolation | Pure |
| Unit | `parse.ts`: malformed record omitted; Timestamp→ISO | Pure |
| Unit | `honeypot.ts`: filled/empty semantics | Pure |
| RTL | ContactForm success/error/retry; ProjectList loading/empty/error (fetch mocked) | jsdom |
| Integration | Route handlers against real Firestore | env-gated `describe.skipIf` when `FIREBASE_SERVICE_ACCOUNT` absent |

Pure modules are separated from Next.js/Admin boundaries so unit suites run with zero Firebase/network.

## Threat Matrix

`N/A — no shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary introduced. HTTP Route Handlers are the only new surface (threats: validation, honeypot, rate limit, credential exposure — covered in D2/D3 and tests).`

## Migration / Rollout

No data migration. Stores are additive; deny-all rules block exposure until credentials exist; APIs can be disabled without breaking static rendering. Rollback = git revert per work-unit commit. `strict_tdd: false` until apply re-detects tooling.

## Deployment / Env

| Variable | Type | Build-time? |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Runtime, server-only (never `NEXT_PUBLIC_`) | No — admin singleton initializes lazily at request time (Node 24 runtime) |

No build-time env vars required. Vercel free subdomain; guide documents Firebase/Firestore enablement, key creation, env setup, deploy.

## Open Questions

- None blocking. (Seed via script is optional — docs also cover manual console entry.)