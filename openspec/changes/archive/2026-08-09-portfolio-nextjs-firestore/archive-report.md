# Archive Report — portfolio-nextjs-firestore

- **Change**: `portfolio-nextjs-firestore`
- **Project**: `portafolio`
- **Status**: ARCHIVED — SDD cycle complete (planned → designed → implemented → verified → archived)
- **Archived at**: 2026-08-09 (ISO `2026-08-09-portfolio-nextjs-firestore`)
- **Implementation/verified commit**: `6b384c0` (branch `master`; the committed tree that was implemented and verified)
- **Archive work-unit commit**: the immediate successor commit carrying this report and the spec sync (sha returned in the orchestrator envelope)
- **Verification outcome**: 0 CRITICAL · 0 blockers · 0 FAILING scenarios; 24/27 scenarios COMPLIANT, 3 UNTESTED-manual (by-design manual gates); 17/19 requirements with covering evidence. Strict envelope verdict per verify-report: `fail` (canonical incomplete-evidence shape — the 3 manual gates cannot be executed in this environment); human verdict per verify-report: **PASS WITH WARNINGS**, archive-ready with owner follow-ups.

## What Shipped

Greenfield single-page portfolio v1 (English identifiers, Spanish UI copy):

- Next.js 16 (App Router) + TypeScript + Tailwind v4 scaffold (`src/`, `@/*` alias, ESLint).
- Single page: sticky anchor nav + mobile menu; Hero → Sobre mí → Habilidades → Proyectos → Experiencia → Educación → Contacto; static profile sections render from typed bundled data (`src/data/*.ts`) with placeholder experience/education entries; GitHub/LinkedIn links.
- Firestore-backed content: `GET /api/projects` (dynamic, uncached, `orderBy sortOrder`, ISO-8601 serialization, malformed records omitted) with loading/empty/error Spanish states via client `ProjectList`.
- `POST /api/contact`: Zod v4 validation → honeypot silent-200 → best-effort in-memory rate limit (429 + Retry-After) → Firestore `contacts` write (`status:"new"`, `source:"portfolio"`, server timestamps) → 201; Spanish success/error UX with retry.
- Security: Admin-SDK-only server credentials via `FIREBASE_SERVICE_ACCOUNT` (no `NEXT_PUBLIC_`, bundle proven credential-free), deny-all `firestore.rules` committed.
- `scripts/seed-projects.mjs`, Spanish setup/deploy guide `docs/setup.md` (es), English `README.md`.
- Tests: Vitest + RTL — **55 passed / 4 env-skipped (1 integration file skipped without `FIREBASE_SERVICE_ACCOUNT`, by design)**, 7 test files passed. `npm run build` / `npm run typecheck` / `npm run lint` all exit 0.

All **21/21 tasks** are `[x]` in the persisted tasks artifact (Phase 1–5: scaffold/tokens/data → lib/API → UI → tests incl. the real honeypot-transmit bug fix → docs). No implementation tasks remain unchecked.

## Spec Sync (delta → main specs)

The four delta specs are full specs (not delta-diff sections); `openspec/specs/` contained no prior main specs, so each was **Created** by direct copy per the openspec convention (no MODIFIED/REMOVED/RENAMED operations, no destructive merge — the `config.yaml` "warn before destructive deltas" archive rule did not trigger).

| Domain | Action | Main spec |
|--------|--------|-----------|
| `profile-presentation` | Created (4 requirements, 8 scenarios) | `openspec/specs/profile-presentation/spec.md` |
| `projects-content` | Created (5 requirements, 7 scenarios) | `openspec/specs/projects-content/spec.md` |
| `contact-form` | Created (5 requirements, 7 scenarios) | `openspec/specs/contact-form/spec.md` |
| `deployment` | Created (5 requirements, 5 scenarios) | `openspec/specs/deployment/spec.md` |

`openspec/specs/` is now the source of truth for these four capabilities.

## Archive Contents (audit trail)

`openspec/changes/archive/2026-08-09-portfolio-nextjs-firestore/` contains:
- `proposal.md` ✅
- `specs/{contact-form,deployment,profile-presentation,projects-content}/spec.md` ✅ (4 delta specs)
- `design.md` ✅
- `tasks.md` ✅ (21/21 complete)
- `verify-report.md` ✅ (persisted after verification; moved with the folder)
- `archive-report.md` ✅ (this file)

Note: no `exploration.md` or `state.yaml` existed in the change folder; exploration output was folded into the proposal and the orchestrator did not persist a `state.yaml`. No `review/` artifacts existed — see Review gate below.

## Engram Lineage (observation IDs)

| Artifact | Obs ID | Topic |
|----------|--------|-------|
| proposal | #18 | `sdd/portfolio-nextjs-firestore/proposal` |
| spec | #19 | `sdd/portfolio-nextjs-firestore/spec` |
| design | #20 | `sdd/portfolio-nextjs-firestore/design` |
| tasks | #21 | `sdd/portfolio-nextjs-firestore/tasks` |
| apply-progress | #22 | `sdd/portfolio-nextjs-firestore/apply-progress` (WU5 run 2, final) |
| verify-report | #23 | `sdd/portfolio-nextjs-firestore/verify-report` |
| archive-report | (see Engram `sdd/portfolio-nextjs-firestore/archive-report`) | this report |

## Review Gate

The change folder contained no `review/` directory (transaction/ledger/receipt/gate-context) and the archive launch carried no `reviewGate` structured status → the native review gate is recorded as **unmanaged** for this change (kill switch off, no review governed this change). No terminal receipt existed or was required; gate does not manufacture `allow`, it simply imposes no requirement. No CRITICAL verification findings exist, so no CRITICAL gate applies.

## Manual Owner Follow-ups (by design — NOT done, do not mark complete)

These gates cannot be executed in this environment (no Chrome/Lighthouse, no Firebase/Vercel credentials/ownership). They are **owner follow-ups**, not code defects:

1. **(a) Lighthouse mobile ≥ 90** (perf/a11y/SEO) — PP-4 clause; requires a dev-browser Lighthouse run after deploy. Code-level a11y evidence exists (focus ring, `lang="es"`, aria attributes).
2. **(b) Visual console-error/overflow + keyboard/AT pass** — PP-4 narrow-viewport usability and keyboard/AT scenarios (task 5.3); code-level checks pass (zero overflow-risk patterns, semantic controls, Escape + focus return); real-browser/AT confirmation pending.
3. **(c) Vercel deploy with `FIREBASE_SERVICE_ACCOUNT` configured** — D-3 (site live at a free Vercel subdomain over HTTPS) is **currently unmet by design** of this environment (no deploy, no live URL). After deploy, also confirm: PC-3 live edit→reload freshness, CF-1/CF-4 real-persist and D-4 rules-published behavior (env-gated integration suite `api-routes.integration.test.ts` runs only with credentials).

## Final-State Notes / Contradictions

- The strict envelope verdict `fail` in `verify-report` (obs #23) reflects evidence-completeness of the manual gates only (`critical_findings: 0`, `blockers: 0`); the human verdict is PASS WITH WARNINGS. No unrankable contradictions were found between the launch-prompt final-state facts, the persisted tasks artifact, and the verify-report.
- `verify-report.md` was written after commit `6b384c0` (untracked at launch); it moved with the folder into the archive and is committed with this work-unit commit.
- Design deviation recorded (non-breaking): `server-only` package not resolvable under Next 16 → the server boundary is enforced in code via a runtime guard in `src/lib/firebase/admin.ts` instead of an `import "server-only"` (documented in the design's coherence section and apply-progress).

## Rollback / Reopen

Rollback of implementation = `git revert` per work-unit commit (stores additive; deny-all rules block exposure until credentials exist). Reopen = copy the archived folder back to `openspec/changes/{change-name}/` and continue; Engram artifacts remain under `sdd/portfolio-nextjs-firestore/*`.