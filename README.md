# Portafolio — Next.js (App Router) + Firestore

A single-page portfolio built with Next.js (App Router), TypeScript, and
Tailwind CSS v4. Static profile sections render from typed constants; projects
and contact messages live in Firestore and are reached exclusively through
Route Handlers via a server-only Firebase Admin singleton. UI copy is Spanish;
identifiers and code are English.

Built spec-first with the SDD workflow — see `openspec/changes/portfolio-nextjs-firestore/`
for the proposal, delta specs, design, and tasks behind every line.

> Guía de aprendizaje completa en español (cómo se construyó, glosario de
> archivos, Firebase/Vercel paso a paso): **[docs/setup.md](docs/setup.md)**
> · Full Spanish learning guide: [docs/setup.md](docs/setup.md)

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4 (editorial-light theme tokens)
- Firebase Admin SDK 14 — Firestore for `projects` and `contacts`
- Zod 4 (server-side validation) · Vitest 4 + Testing Library (test suite)
- Deny-all `firestore.rules`; credentials only via `FIREBASE_SERVICE_ACCOUNT`

## Quick start

Requirements: Node v24 and npm 11.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:3000
```

Without `FIREBASE_SERVICE_ACCOUNT`, the static page still renders; the API
routes return errors at runtime and the Firestore integration tests skip
automatically.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (Turbopack) |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest run (`--passWithNoTests`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | `npm test && npm run lint && npm run build` |

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Only for dynamic data | Full service-account JSON (single line). Server-only — never prefix with `NEXT_PUBLIC_`. Never commit it; `.gitignore` excludes `.env*`. |

Local: create `.env.local` with `FIREBASE_SERVICE_ACCOUNT='{...json...}'`.

Seed two example projects into Firestore (requires the env var in the process):

```bash
FIREBASE_SERVICE_ACCOUNT='{...json...}' node scripts/seed-projects.mjs
```

Firestore rules are deny-all; the Admin SDK bypasses them, so Route Handlers
(`GET /api/projects`, `POST /api/contact`) are the only data-access path.
Publish `firestore.rules` to your Firebase project to block direct access.

## API

- `GET /api/projects` → dynamic, uncached, ordered `Project[]` (Firestore
  edits appear on reload without redeploy).
- `POST /api/contact` → honeypot (silent 200) → rate limit (429 + Retry-After)
  → Zod validation (400) → Firestore write (201 `{ok,id}`); 500 on failure.

## Deploy

Not deployed yet. When ready: import the repo on Vercel, add
`FIREBASE_SERVICE_ACCOUNT` as an environment variable, and deploy — `npm run
build` runs automatically. The main page is static; the API routes run as
dynamic serverless functions.