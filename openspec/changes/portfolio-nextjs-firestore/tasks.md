# Tasks: Portfolio — Next.js (App Router) + Firestore

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2,800–3,400 (greenfield scaffold) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 scaffold → PR 2 lib+API → PR 3 UI → PR 4 tests → PR 5 docs |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Scaffold, tokens, typed data | PR 1 | `npm run typecheck` | `npm run dev` renders static page | Revert scaffold commit; site unused |
| 2 | Types, schemas, lib, API routes, rules | PR 2 | `npm test` (pure units) | `POST /api/contact` via curl with env | Revert PR 2; static UI unaffected |
| 3 | Sections, primitives, form, project list | PR 3 | `npm run test:ui` (RTL) | `npm run dev` full page, mocked fetch | Revert PR 3; APIs stay |
| 4 | Full test suites + build verify + Lighthouse | PR 4 | `npm run verify` = test+lint+build | `npm run build` + local Lighthouse run | Revert PR 4 (tests only) |
| 5 | Spanish docs, README, seed script | PR 5 | `npm run typecheck` | N/A — docs/seed, no page behavior change | Revert PR 5 |

## Phase 1: Foundation

- [x] 1.1 `git init`; `.gitignore` (node_modules, .env*, .next); initial commit
- [x] 1.2 `create-next-app`: TS, Tailwind v4, ESLint, App Router, `src/`, `@/*` alias
- [x] 1.3 Pin deps: firebase-admin ^14.2, zod ^4.4; dev: vitest ^4.1, jsdom, @testing-library/react
- [x] 1.4 `package.json` scripts: dev/build/lint/test/typecheck (`tsc --noEmit`)
- [x] 1.5 `src/types/*.ts`: Project, ContactMessage, ApiResponse
- [x] 1.6 `src/data/*.ts`: profile, socials, skills, experience, education (typed Spanish placeholders)
- [x] 1.7 `globals.css` editorial-light tokens: paper #FAFAF8, teal #0F766E, serif display + sans body, focus ring, reduced motion
- [x] 1.8 `firestore.rules` deny-all committed

## Phase 2: Core (Lib + API)

- [x] 2.1 `src/lib/validation/contact.ts`: zod v4 schema — trim; name 1–100; email lowercase, well-formed, ≤254; message 10–4000
- [x] 2.2 `src/lib/honeypot.ts` + `src/lib/rate-limit.ts` (injectable clock/store; 60s window, 3 max, per-key isolation)
- [x] 2.3 `src/lib/projects/parse.ts`: safeParse → Project[]; Timestamp→ISO-8601; malformed omitted
- [x] 2.4 `src/lib/firebase/admin.ts`: `import "server-only"`; lazy `cert(JSON.parse(env))` singleton, no `NEXT_PUBLIC_`
- [x] 2.5 `src/lib/api.ts`: typed client fetch with `cache:"no-store"`; POST contact helper
- [x] 2.6 `src/app/api/projects/route.ts`: GET → orderBy sortOrder → parse → 200 Project[] (dynamic, uncached)
- [x] 2.7 `src/app/api/contact/route.ts`: POST → honeypot 200 silent → rate-limit 429+Retry-After → zod 400 → Firestore add (status "new", source "portfolio") → 201 {ok,id}; 500 catch
- [x] 2.8 `scripts/seed-projects.mjs`: optional Admin-SDK seed of 2 projects

## Phase 3: UI Integration

- [x] 3.1 `layout.tsx` (lang="es") + `page.tsx` composing sections in order
- [x] 3.2 `src/components/ui/*`: container, buttons, section-heading primitives
- [x] 3.3 Sections (server): sticky header nav + mobile menu, Hero, SobreMí, Habilidades, Experiencia, Educación, Footer with LinkedIn/GitHub (`_blank`)
- [x] 3.4 `ProjectList.tsx` + `ProjectCard.tsx` (numbered index): loading/empty/error Spanish states via `/api/projects`
- [x] 3.5 `ContactForm.tsx` (client): idle/submitting/success/error states; keeps values on failure; hidden honeypot field

## Phase 4: Testing

- [x] 4.1 `vitest.config.ts` + jsdom setup; unit: contact schema (valid/trim/length/email cases)
- [x] 4.2 Unit: rate-limit (window, burst→429, key isolation), honeypot (filled/empty), parse (malformed omitted, ISO)
- [x] 4.3 RTL: ContactForm success/error/retry; ProjectList loading/empty/error (fetch mocked)
- [x] 4.4 Integration: route handlers vs real Firestore, `describe.skipIf` when `FIREBASE_SERVICE_ACCOUNT` absent (direct invocation or supertest)
- [x] 4.5 Verify: `npm run test` + `npm run lint` + `npm run build` pass; Lighthouse mobile ≥90 (perf/a11y/SEO) — scripted verify green via `npm run verify`; Lighthouse ≥90 is a manual dev-browser run (no Chrome/lighthouse tooling in apply env), tallied in apply-progress

## Phase 5: Documentation / Cleanup

- [ ] 5.1 `docs/setup.md` (es): SDD walkthrough, file glossary, local run, Firebase/Vercel env setup — completable unassisted
- [ ] 5.2 `README.md`: run/setup instructions (English)
- [ ] 5.3 Final pass: no console errors, no horizontal overflow, keyboard-operable nav/links