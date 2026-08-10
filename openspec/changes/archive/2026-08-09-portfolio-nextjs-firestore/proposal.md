# Proposal: Portfolio — Next.js (App Router) + Firestore

## Intent

Greenfield: `portafolio/` holds only SDD bootstrap. This change ships a complete recruiter-facing v1 — a single-page Next.js (App Router) + TypeScript site with Spanish UI copy, dynamic project content and contact messages in Firestore (Route Handlers only, Admin SDK), deployed on a free Vercel subdomain, plus a Spanish setup guide. Reason: the portfolio IS the product; the user needs proof-of-work content editable without code (projects) and a contact channel, kept fast, small, and secure.

## Scope

### In Scope
- Next.js 16 + TypeScript + Tailwind v4 scaffold (`src/`, `@/*` alias, ESLint, prettier)
- Single page: sticky anchor nav + mobile menu; Hero → Sobre mí → Habilidades → Proyectos → Experiencia → Educación → Contacto
- Typed static data (`src/data/*.ts`): profile, socials, skills, experience, education (editable placeholder copy for experience/education)
- Firestore stores + Route Handlers: `GET /api/projects`, `POST /api/contact` (Zod, honeypot, best-effort in-memory rate limit)
- Security: Admin SDK server-side only, deny-all `firestore.rules`, credentials via `FIREBASE_SERVICE_ACCOUNT` (never `NEXT_PUBLIC_`)
- Seed 2 projects (model allows more); Vercel subdomain deploy; Spanish guide in `docs/`; Vitest + RTL tests

### Out of Scope
- Email/Slack notifications (v1: owner reads Firebase console), custom domain, admin UI, project detail pages, full markdown rendering, Redis rate limiting, all-static or all-Firestore content strategies

## Capabilities

> Contract with sdd-spec: each entry becomes `openspec/specs/<name>/spec.md`.

### New Capabilities
- `profile-presentation`: layout + nav, static profile sections (hero, about, skills, experience, education) from typed constants, Spanish copy, responsive + accessibility baseline
- `projects-content`: Firestore `projects` model (title, summary, description, technologies, links, featured, sortOrder), `GET /api/projects`, dynamic rendering with loading/empty/error states
- `contact-form`: Firestore `contacts` model + status workflow, `POST /api/contact` (Zod, honeypot, rate limit), form UX (success/error, Spanish); carries shared security posture (deny-all rules, Admin-SDK-only credentials)
- `deployment`: Vercel subdomain target, `FIREBASE_SERVICE_ACCOUNT` env setup, Firebase/Firestore enablement steps, Spanish step-by-step guide in `docs/`

### Modified Capabilities

None.

## Approach

`create-next-app` scaffold (TypeScript, Tailwind, ESLint, App Router, `src/`); sections render typed constants; all Firestore access through an Admin SDK singleton inside Route Handlers; single-field queries (`orderBy sortOrder` / `createdAt`) avoid composite indexes; hybrid static/dynamic split per exploration. User picks design direction (A/B/C) in design phase.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/` | New | Layout, page, sections, API route handlers |
| `src/components/`, `src/data/`, `src/lib/`, `src/types/` | New | UI components, typed constants, admin/client libs, schemas |
| `firestore.rules` | New | Deny-all rules committed |
| `docs/` | New | Spanish setup/deploy guide |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Manual Firebase/Vercel setup blocks verification | High | Exact steps in docs; env-gated test skips |
| Next 16 / Tailwind v4 caching & config churn | Med | Pin versions; decide revalidate in design |
| Public contact endpoint abuse | Med | Zod + honeypot + IP rate limit; Redis path documented |
| Rules/data drift in schemaless store | Med | Deny-all committed; read-time Zod parsing |

## Rollback Plan

Git revert per work-unit commit (scaffold → sections → API → integration → docs). Stores are additive; deny-all rules block exposure until creds are configured. APIs can be disabled without breaking static-constant rendering; archive = remove change folder.

## Dependencies

- Firebase project with Firestore enabled + service account key (user)
- Vercel account (user)
- Node v24, npm 11 (present)

## Success Criteria

- [ ] Clean `next build`; site live at Vercel subdomain
- [ ] Lighthouse mobile ≥ 90 (perf, a11y, SEO)
- [ ] Form writes to Firestore; honeypot blocks bots; rate limit throttles bursts
- [ ] Project edits in Firestore appear on site without redeploy
- [ ] User completes `docs/` guide end-to-end unassisted