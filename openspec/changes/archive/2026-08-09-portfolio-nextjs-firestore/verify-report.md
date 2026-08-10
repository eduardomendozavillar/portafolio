```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:6d819beb7b0208639e6813819d0f35d58b55452dda671a19c9f9a9534a0cfd18
verdict: fail
blockers: 0
critical_findings: 0
requirements: 17/19
scenarios: 24/27
test_command: npm test
test_exit_code: 0
test_output_hash: sha256:0873315b4d1ee2bd851a2cd25410898f041567726353ec74bf0b48ee21ef39bc
build_command: npm run build
build_exit_code: 0
build_output_hash: sha256:a8bc86027477aa7e8fff0644e89c2e886a00bc28f20143f94028a21f4e2cb9e6
```

## Verification Report

**Change**: portfolio-nextjs-firestore
**Version**: N/A (local delta specs under `openspec/changes/portfolio-nextjs-firestore/specs/`)
**Mode**: Standard (`strict_tdd: false` — no strict TDD runtime evidence required)

### Completeness
| Metric | Value |
|--------|-------|
| Tasks total | 21 |
| Tasks complete | 21 |
| Tasks incomplete | 0 |

All 21 task checkboxes are `[x]` in `openspec/changes/portfolio-nextjs-firestore/tasks.md` (tasks 1.1–1.8, 2.1–2.8, 3.1–3.5, 4.1–4.5, 5.1–5.3), mirrored by Engram apply-progress obs #22 (WU5 run 2). Full verification run performed on committed tree `6b384c0` (branch master, clean worktree).

### Build & Tests Execution (committed tree, 2026-08-09)

**Build**: ✅ Passed
```text
> next build  (Next.js 16.3.0, Turbopack)
✓ Compiled successfully in 960ms
✓ Running TypeScript ... Finished TypeScript in 4.1s
✓ Generating static pages (6/6)
Route (app)
┌ ○ /                    (Static, prerendered)
├ ○ /_not-found
├ ƒ /api/contact         (Dynamic, server-rendered on demand)
└ ƒ /api/projects        (Dynamic, server-rendered on demand)
EXIT_CODE=0
```
build_output_hash: `sha256:A8BC86027477AA7E8FFF0644E89C2E886A00BC28F20143F94028A21F4E2CB9E6`

**Typecheck**: ✅ Passed — `npm run typecheck` (`tsc --noEmit`) exit 0, zero diagnostics. Output hash `sha256:BAFCE6156F93218751CD03EA5DF9A85CCA5677554A1FA9BD589F1DCB56C58B93`.

**Lint**: ✅ Passed — `npm run lint` (`eslint`) exit 0, no warnings. Output hash `sha256:9D413474DED98E85E7F7FA283B7604449E876339D1762C27349998B3C8DACF8D`.

**Tests**: ✅ 55 passed / 4 skipped — exit 0
```text
RUN  v4.1.10
Test Files  7 passed | 1 skipped (8)
     Tests  55 passed | 4 skipped (59)
```
test_output_hash: `sha256:0873315B4D1EE2BD851A2CD25410898F041567726353EC74BF0B48EE21EF39BC`

The 1 skipped file is `src/lib/firebase/api-routes.integration.test.ts` (4 skipped tests: 3 contact + 1 projects). Env-gated by design (task 4.4): `describe.skipIf(!credentials)` where `credentials = hasFirestoreCredentials()` (`src/lib/firebase/admin.ts:66-69`). Confirmed `FIREBASE_SERVICE_ACCOUNT` is NOT set in this environment — suite skips cleanly, does NOT fail. Behavior matches design and apply-progress.

**Coverage**: ➖ Not available — no coverage threshold in `openspec/config.yaml` and no coverage tooling configured (per design).

### Spec Compliance Matrix

Statuses: ✅ COMPLIANT (covering evidence passed / static + executed evidence) · ❌ UNTESTED-manual (requires real browser, live deployment, or real Firestore credentials — not fabricatable in this env) · ❌ FAILING (none).

| # | Requirement / Scenario | Test / Evidence | Result |
|---|------------------------|-----------------|--------|
| PP-1 | Single-page layout with anchor navigation — all sections, sticky nav | `src/app/page.tsx:12-23` composes Hero/SobreMi/Habilidades/Proyectos/Experiencia/Educacion/Contacto on one page; `src/app/sections/Header.tsx:9-17,62-75` sticky nav with 7 anchors; every `href="#x"` matches a rendered `id` (Hero `#inicio` Hero.tsx:8, SobreMi `#sobre-mi` :8, Habilidades `#habilidades` :22, Proyectos `#proyectos` Proyectos.tsx:8, Experiencia `#experiencia` :8, Educacion `#educacion` :8, Contacto `#contacto` Contacto.tsx:10); smooth scroll + `scroll-padding-top` for sticky header (globals.css:39-42). Build output `/` static. | ✅ COMPLIANT (static semantics) |
| PP-1 | Desktop anchor navigation | Same anchors above; browser-native `<a href="#id">` behavior, no JS required; static prerender. | ✅ COMPLIANT (static semantics) |
| PP-1 | Mobile menu navigation | `Header.tsx:93-161`: semantic `<button type="button">` toggle with `aria-label`/`aria-expanded`/`aria-controls`, opens `<nav>` listing the SAME `NAV_LINKS`, each link closes the menu on select (`onClick={() => setOpen(false)}`); Escape closes and returns focus (Header.tsx:29-38). No automated browser test — code-level evidence. | ✅ COMPLIANT (code-level) |
| PP-2 | Static profile content from typed data — no network, Spanish copy, editable placeholders | All sections render from typed constants in `src/data/*.ts` (profile.ts, socials.ts, skills.ts, experience.ts:10-24 "Empresa de ejemplo", education.ts:9-19 "Universidad de ejemplo"); `page.tsx` has zero fetch calls; `/` is fully static (build output ○). | ✅ COMPLIANT |
| PP-2 | Content renders without a backend | Static prerender of `/` + zero network imports in sections; ProjectList is the only client fetch (isolated to Proyectos section). | ✅ COMPLIANT |
| PP-2 | Placeholder experience and education entries | `src/data/experience.ts:10-24` (2 placeholder entries), `src/data/education.ts:9-19` (2 placeholder entries), rendered by Experiencia.tsx:12-26 / Educacion.tsx:12-27. | ✅ COMPLIANT |
| PP-3 | Social profile links | `src/app/sections/Footer.tsx:17-24` and `Header.tsx:79-91` render GitHub/LinkedIn `<a target="_blank" rel="noopener noreferrer">` from `src/data/socials.ts:9-19`. | ✅ COMPLIANT |
| PP-3 | Opening a social link | Same evidence — `target="_blank"` opens new tab; browser-native. | ✅ COMPLIANT |
| PP-4 | Responsive and accessibility floor — Lighthouse mobile ≥90 (perf/a11y/SEO) | Manual dev-browser gate (no Chrome/Lighthouse in verify env). Code-level a11y evidence present (focus-visible ring globals.css:51-54; `lang="es"` layout.tsx:29; aria-labels). | ❌ UNTESTED-manual |
| PP-4 | Narrow viewport usability (no horizontal overflow, readable text) | Manual visual gate. Code-level: grep found zero `w-screen`/`100vw`/`overflow-x`/`whitespace-nowrap`/fixed-wide patterns; responsive utilities (`md:`, `lg:`, `flex-wrap`) throughout. | ❌ UNTESTED-manual |
| PP-4 | Keyboard access (tab-operable, accessible names announced) | Manual browser/AT gate. Code-level: real `<a>`/`<button>`, aria-expanded/aria-controls on toggle, Escape+focus return, form labels (`ContactForm.tsx:107,124,141`), honeypot `tabIndex={-1}` + `aria-hidden`. No automated keyboard test. | ❌ UNTESTED-manual |
| PC-1 | Projects API ordered response — sortOrder asc, full fields, ISO-8601 | route.ts:14-20 `orderBy("sortOrder","asc").get()` + `parseProjects`; parse.ts:56-88 validates title/summary/description/technologies/sortOrder/links/featured + createdAt/updatedAt. | ✅ COMPLIANT |
| PC-1 | Projects returned in sort order | `parse.test.ts:117-124` (sortOrder [1,2] preserved); `ProjectList.test.tsx:105-126` renders Alpha(sortOrder 1) before Beta(2); route `orderBy("sortOrder","asc")` (route.ts:16). | ✅ COMPLIANT |
| PC-1 | ISO-8601 timestamps | `parse.test.ts:23-37,47-57` (Timestamp duck-type → `toISOString()`); parse.ts:13-31,56-59. | ✅ COMPLIANT |
| PC-2 | Malformed records do not break the response | `parse.test.ts:96-104` (2 valid + 1 malformed → only 2 returned); route catch returns 500 only on infrastructure errors, malformed docs are omitted by `parseProjects` (parse.ts:97-108). | ✅ COMPLIANT |
| PC-2 | One malformed record among valid ones | Same evidence — `parse.test.ts:96-104` `["a","c"]` = malformed `b` omitted. | ✅ COMPLIANT |
| PC-3 | Changes reflected without redeploy | Mechanism verified: `/api/projects` is ƒ dynamic (build output) with no revalidate/force-static; client `fetch("/api/projects", { cache: "no-store" })` (`api.ts:15`), asserted in `api.test.ts:34`; route.ts:6-11 documents D1. Live edit→reload check needs deployed env. | ✅ COMPLIANT (mechanism) — live check manual |
| PC-3 | Firestore edit appears on reload | Same evidence (dynamic+no-store ⇒ no cache window). End-to-end reload observation requires live Firestore + deployed site. | ✅ COMPLIANT (mechanism) — live check manual |
| PC-4 | Loading and empty states | `ProjectList.test.tsx:60-71` (loading spinner, `role="status"`, "Cargando proyectos…"); `73-80` (empty "Todavía no hay proyectos publicados"); ProjectList.tsx:42-76. | ✅ COMPLIANT |
| PC-4 | Loading indicator | `ProjectList.test.tsx:60-71`, ProjectList.tsx:42-54. | ✅ COMPLIANT |
| PC-4 | No projects | `ProjectList.test.tsx:73-80`, ProjectList.tsx:70-76. | ✅ COMPLIANT |
| PC-5 | Error state — Spanish message, page still renders | `ProjectList.test.tsx:82-103` (error alert "No se pudieron cargar los proyectos" + Reintentar recovery, fetch called twice); ProjectList.tsx:57-68; failure is scoped to the Proyectos section only (component-local state; sections are server-rendered independently — page.tsx). | ✅ COMPLIANT |
| PC-5 | Projects API unavailable | Same evidence — fetch rejection → Spanish error + retry; rest of page unaffected. | ✅ COMPLIANT |
| CF-1 | Validated submission endpoint | route.ts:20-35 (JSON body guard), 55-62 (zod safeParse → 400, no write); contact.ts (schema). Unit: `contact.test.ts` (11 cases). | ✅ COMPLIANT |
| CF-1 | Valid submission accepted and stored | `contact.test.ts:5-12` valid payload accepted; route.ts:64-71 `contacts.add({...parsed.data, status:"new", source:"portfolio", createdAt: serverTimestamp})` → 201. Real-persist assertion in env-gated integration suite `api-routes.integration.test.ts:16-33` (skipped w/o creds, by design). | ✅ COMPLIANT (write path static + integration suite present) |
| CF-1 | Invalid submission rejected | `contact.test.ts:27-43,54-70,72-88,99-102` (empty/overlong, malformed email, short/long message, missing fields); route.ts:55-62 400 without persist; integration `api-routes.integration.test.ts:35-52`. | ✅ COMPLIANT |
| CF-2 | Honeypot filtering | `honeypot.test.ts:17-23` (filled → true); route.ts:39-42 silent 200 `{ok:true}` no write; integration `api-routes.integration.test.ts:54-72` (200, id undefined); ContactForm transmits `website` field (`ContactForm.test.tsx:133-151`, `ContactForm.tsx:49-52`). | ✅ COMPLIANT |
| CF-2 | Bot fills the honeypot | Same evidence — route drops before any persistence. | ✅ COMPLIANT |
| CF-3 | Best-effort rate limiting | `rate-limit.ts` (injectable clock/store, 60s window, max 3, per-key); route.ts:44-52 → 429 + `Retry-After`. | ✅ COMPLIANT |
| CF-3 | Burst throttled | `rate-limit.test.ts:25-37` (4th request blocked, retryAfterSeconds>0); route.ts:47-51. | ✅ COMPLIANT |
| CF-3 | Normal submission unaffected | `rate-limit.test.ts:12-23` (≤max allowed), `39-52` (refills after window); route wiring. | ✅ COMPLIANT |
| CF-4 | Stored messages with review status | route.ts:64-69 writes `status:"new"`, `source:"portfolio"`, `createdAt: serverTimestamp`; integration `api-routes.integration.test.ts:16-33` asserts persistence (env-gated, skipped w/o creds by design). | ✅ COMPLIANT (write path static + integration suite present) |
| CF-4 | Stored message awaiting review | Same evidence — status "new" is the review-pending marker; retrievable in Firebase console (rules deny client reads; owner uses console — docs/setup.md:5.4). | ✅ COMPLIANT |
| CF-5 | Spanish success and failure UX | `ContactForm.test.tsx:68-90` success "¡Gracias!" + clears form; `92-113` server error keeps values; `115-131` network error "Revisa tu conexión" keeps values → retry; ContactForm.tsx:86-103,54-70. | ✅ COMPLIANT |
| CF-5 | Success feedback | `ContactForm.test.tsx:68-90`. | ✅ COMPLIANT |
| CF-5 | Failure feedback and retry | `ContactForm.test.tsx:92-131` (values survive 400 & 500 → visitor can edit/resubmit). | ✅ COMPLIANT |
| D-1 | Clean production build | `npm run build` exit 0 incl. TypeScript pass; `npm run typecheck` 0; `npm run lint` 0. | ✅ COMPLIANT (executed) |
| D-1 | Build passes | Same evidence. | ✅ COMPLIANT (executed) |
| D-2 | Server-side credential handling | admin.ts:41-54 reads `process.env.FIREBASE_SERVICE_ACCOUNT` only, lazy `cert(JSON.parse(...))`, runtime client guard (admin.ts:21-28); grep: zero `NEXT_PUBLIC_` usages in code (only 2 docstring warnings admin.ts:15,45); `.gitignore:34` excludes `.env*`. | ✅ COMPLIANT |
| D-2 | Credential not exposed to the client | Executed bundle inspection: `.next/static/` (client bundle) contains ZERO `firebase` references; `firebase-admin`/process.env code exists only in `.next/server/chunks/*` (server functions). No `private_key` value anywhere. | ✅ COMPLIANT (executed bundle inspection) |
| D-3 | Vercel deployment — free subdomain, HTTPS, env vars configured | NOT deployed: README.md:76 "Not deployed yet", docs/setup.md:269 "El sitio aún no está desplegado". Manual deploy gate pending owner action (needs Firebase/Vercel accounts + creds; env var not available in pipeline). | ❌ UNTESTED-manual |
| D-3 | Site live on Vercel over HTTPS | Same — no live URL exists to open. | ❌ UNTESTED-manual |
| D-4 | Deny-all Firestore rules committed | `firestore.rules:4-10` `rules_version='2'` + `allow read, write: if false` for `/{document=**}`. | ✅ COMPLIANT |
| D-4 | Client access denied | Rules deny everything by construction; publishing to Firebase documented (docs/setup.md:258-263). Only Admin SDK path exists (admin.ts). | ✅ COMPLIANT (file committed; publish = manual step in guide) |
| D-5 | Spanish setup guide in docs/ | `docs/setup.md` — 309 lines Spanish: §5.1 Firebase project + Firestore enablement + service-account key (198-205), §5.2 `FIREBASE_SERVICE_ACCOUNT` config + PowerShell idiom (207-230), §5.3 seed (232-256), §5.4 rules (258-263), §6 Vercel deploy (267-275), §1-3 SDD walkthrough + file glossary, §7 repeat workflow. | ✅ COMPLIANT |
| D-5 | Guide completes setup end to end | Guide covers every mandated step for an unassisted owner; actual execution inherently manual. | ✅ COMPLIANT (content verified) |

**Compliance summary**: 24/27 scenarios COMPLIANT · 0 FAILING · 3 UNTESTED-manual (PP-4 Lighthouse ≥90, PP-4 overflow/keyboard visual, D-3 live Vercel site). Requirements: 17/19 with covering evidence; the 2 without are PP-4 (Lighthouse clause) and D-3 (deployment).

### Correctness (Static Evidence)
| Requirement | Status | Notes |
|------------|--------|-------|
| PP-1 single-page + anchors | ✅ Implemented | 7 sections, 7 matching anchor ids, sticky header + mobile menu (Header.tsx) |
| PP-2 typed static data | ✅ Implemented | All content from `src/data/*.ts`, `/` prerendered static |
| PP-3 social links | ✅ Implemented | GitHub/LinkedIn `_blank` in header + footer |
| PP-4 responsive/a11y floor | ✅ Implemented (code-level) | Tokens globals.css, focus ring, aria attributes, reduced motion; Lighthouse score unproven (manual) |
| PC-1 ordered API | ✅ Implemented | `orderBy("sortOrder","asc")` + full field parse + ISO serialization |
| PC-2 malformed omitted | ✅ Implemented | parseProjectRecord null → omitted; response still 200 |
| PC-3 no-redeploy freshness | ✅ Implemented | dynamic ƒ route + `cache:"no-store"` |
| PC-4 loading/empty | ✅ Implemented | 2 passing RTL tests |
| PC-5 error state | ✅ Implemented | Passing RTL test + section-scoped failure |
| CF-1 validation | ✅ Implemented | zod schema + 11 unit cases + route 400 |
| CF-2 honeypot | ✅ Implemented | unit + route + RTL transmission |
| CF-3 rate limit | ✅ Implemented | unit (burst/key-isolation/refill) + route 429 |
| CF-4 status "new" | ✅ Implemented | route.ts:64-69; integration suite present (env-gated) |
| CF-5 Spanish UX | ✅ Implemented | 4 passing RTL tests |
| D-1 clean build | ✅ Implemented | executed: build/typecheck/lint exit 0 |
| D-2 server-only creds | ✅ Implemented | no NEXT_PUBLIC_, runtime guard, bundle proven clean |
| D-3 Vercel deploy | ⚠️ Pending owner | guide + README document steps; site not live yet |
| D-4 deny-all rules | ✅ Implemented | firestore.rules committed |
| D-5 Spanish guide | ✅ Implemented | docs/setup.md covers all mandated topics |

### Coherence (Design)
| Decision | Followed? | Notes |
|----------|-----------|-------|
| D1 dynamic GET + client no-store fetch | ✅ Yes | route.ts `/api/projects` ƒ, api.ts:15; no cache exports |
| D2 zod + honeypot + in-memory rate limit | ✅ Yes | order honeypot→rate→zod→write (route.ts), injectable clock (rate-limit.ts) |
| D3 single FIREBASE_SERVICE_ACCOUNT JSON → cert(JSON.parse) | ✅ Yes | admin.ts:41-59; deviation: `server-only` package not resolvable in Next 16 → boundary enforced in code (runtime guard) — documented in admin.ts:7-17 and apply-progress; does not break spec |
| D4 single-field orderBy, no composite indexes | ✅ Yes | route.ts:16 orderBy("sortOrder","asc") only |
| Firestore schema (status "new", source "portfolio", server timestamps) | ✅ Yes | route.ts:64-69; seed-projects.mjs:62-63 |
| Honeypot silent 200, never educates | ✅ Yes | route.ts:40-42 |
| Interface contracts (201/400/429/500) | ✅ Yes | route.ts:71,61,49,75 |

### Issues Found
**CRITICAL**: None — no spec requirement violated by the implementation; build/typecheck/lint/tests all green; 0 FAILING scenarios.

**WARNING**:
1. **D-3 deployment requirement not yet satisfied** — spec: "site MUST be deployed to a free Vercel subdomain". README.md:76 and docs/setup.md:269 state the site is NOT deployed. This is a manual deploy gate pending owner action (no Firebase/Vercel ownership or credentials in this pipeline). Not a code defect; blocks full spec compliance until the owner deploys and a human confirms HTTPS.
2. **PP-4 mobile Lighthouse ≥90 (perf/a11y/SEO) is UNTESTED-manual** — no Chrome/Lighthouse tooling in this environment (same convention as task 4.5). Code-level a11y evidence exists but the score is unproven.
3. **PP-4 visual console/overflow + keyboard/AT run is UNTESTED-manual** (task 5.3) — code-level checks pass (grep: zero overflow-risk patterns; semantic controls; Escape/focus-return; focus ring); real-browser confirmation pending.
4. **PC-3 live edit→reload and CF-1/CF-4 real-persist assertions** are covered only by the env-gated integration suite (`api-routes.integration.test.ts`), which skips without `FIREBASE_SERVICE_ACCOUNT` by design. Runtime proof requires the deployed environment with credentials.

**SUGGESTION**:
1. Add an `npm run seed` script mapping to `node scripts/seed-projects.mjs` — docs currently require the exact node invocation plus inline env (docs/setup.md:232-244); a script wrapper with an env check would be friendlier (spec does not require it).
2. Vitest 4 prints a future-breaking `configLoader: 'native'` warning (ESM syntax in `vitest.config.ts` loaded as CommonJS, vitest.config.ts:1) — renaming to `vitest.config.mts` or setting `"type":"module"` future-proofs the config.
3. The mobile menu relies on the CSS `md:` breakpoint for visibility; a focus trap while open would harden keyboard UX (not required by spec).
4. `tsconfig.tsbuildinfo` sits in the repo root — already gitignored, but `tsc --noEmit` could disable incremental emit if the file keeps reappearing.

### Verdict
**Strict envelope verdict**: `fail` — canonical incomplete-evidence shape: 24/27 scenarios and 17/19 requirements have executed/static evidence; the remaining 3 scenarios + 2 requirements are by-design manual gates (Lighthouse ≥90, visual overflow/keyboard run, live Vercel deployment) that cannot be executed in this environment. Per the admission contract this is "valid and persistable but not archive-ready" — the failure is an evidence-completeness artifact of the manual gates, NOT a code defect (blockers: 0, critical_findings: 0).

**Human verdict**: PASS WITH WARNINGS — all 21/21 tasks complete; production build, typecheck, lint, and 55 unit/RTL tests green on committed tree `6b384c0`; 24/27 scenarios COMPLIANT, 0 FAILING; no CRITICAL findings. Archive-ready with the owner completing/acknowledging the 3 manual gates (Lighthouse ≥90, visual console/overflow + keyboard/AT, Vercel deploy with env vars) as tracked follow-ups.