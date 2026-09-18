# Portafolio — Eduardo Mendoza Villar

**Live:** [portafolio-psi-five-95.vercel.app](https://portafolio-psi-five-95.vercel.app)

Single-page portfolio built with Next.js 16 (App Router), TypeScript, and
Tailwind CSS v4. Designed for recruiters — answers *who*, *what*, and *how to
contact* in under 10 seconds.

**Visual identity:** Circuit Night — dark systems/applied-AI theme with cyan
accent signal. Outfit (display) + Source Sans 3 (body).

Spanish UI copy; identifiers and code are English.

> Guía de aprendizaje completa en español: [docs/setup.md](docs/setup.md)

---

## What's on the site

- **Hero** — profile photo, role thesis, and CTAs
- **Projects** — featured work with maturity badges (En producción / En desarrollo)
- **About** — real CV narrative
- **Skills** — languages, frontend, backend, AI, data, tools
- **Experience** — work history with dates and descriptions
- **Education** — degrees and certifications
- **Contact** — form with email notification via Resend

Static sections render from typed constants (`src/data/`); projects and contact
messages are stored in Firestore and accessed through Route Handlers.

---

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4 — Circuit Night dark theme tokens (`globals.css`)
- Outfit (display) + Source Sans 3 (body) via `next/font`
- Firebase Admin SDK 14 — Firestore for `projects` and `contacts`
- Resend — email notifications from the contact form
- Zod 4 (server-side validation) · Vitest 4 + Testing Library

---

## Quick start

Requirements: Node v24 and npm 11.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:3000
```

Without `FIREBASE_SERVICE_ACCOUNT`, the static page still renders; the API
routes return errors at runtime and the Firestore integration tests skip
automatically.

---

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

---

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Only for dynamic data | Full service-account JSON (single line). Server-only — never prefix with `NEXT_PUBLIC_`. Never commit it; `.gitignore` excludes `.env*`. |
| `RESEND_API_KEY` | Only for email | Resend API key for contact form notifications. Server-only. |

Local: create `.env.local` with both variables.

Seed example projects into Firestore (requires the env var):

```bash
FIREBASE_SERVICE_ACCOUNT='{...json...}' node scripts/seed-projects.mjs
```

Firestore rules are deny-all; the Admin SDK bypasses them, so Route Handlers
are the only data-access path.

---

## API

- `GET /api/projects` → dynamic, uncached, ordered `Project[]` (Firestore
  edits appear on reload without redeploy).
- `POST /api/contact` → honeypot (silent 200) → rate limit (429 + Retry-After)
  → Zod validation (400) → Resend email + Firestore write (201 `{ok,id}`);
  500 on failure.

---

## Deploy

Auto-deploy on push to `master` via Vercel + GitHub integration.

Required environment variables on Vercel:
- `FIREBASE_SERVICE_ACCOUNT`
- `RESEND_API_KEY`

The main page is static; API routes run as dynamic serverless functions.

---

## Connect

- [GitHub](https://github.com/eduardomendozavillar)
- [LinkedIn](https://www.linkedin.com/in/eduardo-mendoza-ing-sistemas)
